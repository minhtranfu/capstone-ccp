package jaxrs.resources;

import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import daos.TransactionDateChangeRequestDAO;
import dtos.notifications.NotificationDTO;
import dtos.requests.TransactionDateChangeRequestRequest;
import dtos.responses.GETListResponse;
import dtos.responses.MessageResponse;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.util.List;

@RolesAllowed("contractor")
@Path("transactionDateChangeRequests")
public class TransactionDateChangeResource {

	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	TransactionDateChangeRequestDAO transactionDateChangeRequestDAO;

	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractId() {
		return claimContractorId.getValue().longValue();
	}

	@Inject
	ModelConverter modelConverter;


	public TransactionDateChangeResource() {
	}

	@GET
	public Response getRequestForChangingHiringDate(@QueryParam("transactionId") Long transactionId
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy

	) {
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		if (transactionId == null) {
			throw new BadRequestException("transactionId must not be null");
		}
		// TODO: 4/13/19 valdiate authority
		HiringTransactionEntity hiringTransaction = hiringTransactionDAO.findByIdWithValidation(transactionId);
		if (hiringTransaction.getRequester().getId() != getClaimContractId()
				&& hiringTransaction.getEquipment().getContractor().getId() != getClaimContractId()) {
			throw new BadRequestException("Only requester or supplier can view these time extensions requests");
		}

		GETListResponse<TransactionDateChangeRequestEntity> result = transactionDateChangeRequestDAO.getRequestsByTransactionId(transactionId, limit, offset, orderBy);

		return Response.ok(result).build();
	}

	@POST
	public Response requestChangingHiringDate(@Valid TransactionDateChangeRequestRequest transactionDateChangeRequestRequest) {
		TransactionDateChangeRequestEntity transactionDateChangeRequestEntity = modelConverter.toEntity(transactionDateChangeRequestRequest);
		HiringTransactionEntity hiringTransactionEntity = hiringTransactionDAO.findByIdWithValidation(transactionDateChangeRequestRequest.getHiringTransactionEntity().getId());

		// 2/10/19 validate authority of requester
		if (hiringTransactionEntity.getRequester().getId() != claimContractorId.getValue().longValue()) {
			throw new BadRequestException("Only requester can extend hiring time");
		}

		// validate transaction status must be ACCEPTED or PROCESSING
		if (hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.ACCEPTED
				&& hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.PROCESSING) {
			throw new BadRequestException("transaction status must be ACCEPTED or PROCESSING to extend hiring time!");
		}


		// validate if there's no other pending requests
		transactionDateChangeRequestDAO.validateOnlyOnePendingRequest(hiringTransactionEntity.getId());


		// TODO: 4/13/19 validate new end date must after transaction's endDate
		if (!transactionDateChangeRequestRequest.getRequestedEndDate().isAfter(hiringTransactionEntity.getEndDate())) {
			throw new BadRequestException("Extended end date must be after current end date");
		}


		// TODO: 4/13/19 validate new end date must after today
		if (!transactionDateChangeRequestRequest.getRequestedEndDate().isBefore(LocalDate.now())) {
			throw new BadRequestException("Extended end date must not before today");
		}

		// TODO: 4/13/19 validate equipment available on that date
		if (!equipmentDAO.validateEquipmentAvailable(
				hiringTransactionEntity.getEquipment().getId(),
				hiringTransactionEntity.getEndDate().plusDays(1)
				, transactionDateChangeRequestRequest.getRequestedEndDate())) {
			throw new BadRequestException("equipment is not available on the requested time range!");
		}

		//set transaction id
		transactionDateChangeRequestEntity.setHiringTransactionEntity(hiringTransactionEntity);

		//  1/30/19 set status to pending
		transactionDateChangeRequestEntity.setStatus(TransactionDateChangeRequestEntity.Status.PENDING);

		transactionDateChangeRequestDAO.persist(transactionDateChangeRequestEntity);
		return Response.status(Response.Status.CREATED).entity(modelConverter.toResponse(transactionDateChangeRequestDAO.findByID(transactionDateChangeRequestEntity.getId()))).build();

	}


	@DELETE
	@Path("{requestId:\\d+}")
	public Response deleteRequestForChangingHiringDate(@PathParam("requestId") long requestId) {
		// 2/10/19 validate authority
		//validate if existing pending requests
		TransactionDateChangeRequestEntity transactionDateChangeRequestEntity =
				transactionDateChangeRequestDAO.findByIdWithValidation(requestId);
		HiringTransactionEntity hiringTransactionEntity = transactionDateChangeRequestEntity.getHiringTransactionEntity();
		transactionDateChangeRequestDAO.findByIdWithValidation(requestId);
		if (getClaimContractId() != hiringTransactionEntity.getRequester().getId()) {
			throw new BadRequestException("Only requester can cancel this date request");
		}


		transactionDateChangeRequestEntity.setIsDeleted(true);
		transactionDateChangeRequestDAO.merge(transactionDateChangeRequestEntity);
		return Response.ok(new MessageResponse("Pending requests deleted successfully!")).build();


	}

	@PUT
	@Path("{requestId:\\d+}")
	public Response changeStatusRequestForChangingHiringDate(@PathParam("requestId") long requestId,
															 TransactionDateChangeRequestEntity entity) {


		//validate if existing pending requests
		if (entity.getStatus() == TransactionDateChangeRequestEntity.Status.PENDING) {
			throw new BadRequestException("Status body must not be PENDING");
		}

		TransactionDateChangeRequestEntity foundAdjustDateRequest =
				transactionDateChangeRequestDAO.findByIdWithValidation(requestId);
		HiringTransactionEntity hiringTransactionEntity = foundAdjustDateRequest.getHiringTransactionEntity();


		EquipmentEntity equipment = hiringTransactionEntity.getEquipment();
		ContractorEntity supplier = hiringTransactionEntity.getEquipment().getContractor();
		ContractorEntity requester = hiringTransactionEntity.getRequester();

		if (foundAdjustDateRequest.getStatus() != TransactionDateChangeRequestEntity.Status.PENDING) {
			throw new BadRequestException(String.format("Cannot change from %s to %s",
					foundAdjustDateRequest.getStatus(), entity.getStatus()));
		}
		switch (entity.getStatus()) {
			case PENDING:

			case CANCELED:

				// TODO: 4/13/19 only requester can deny
				if (getClaimContractId() != requester.getId()) {
					throw new BadRequestException("Only requester can cancel request for time extension");

				}
				break;
			case ACCEPTED:

				if (getClaimContractId() != equipment.getContractor().getId()) {
					throw new BadRequestException("Only supplier can accept request for time extension");

				}
				// TODO: 4/13/19 validate status must be accepted or processing
				if (hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.ACCEPTED
						&& hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.PROCESSING
				) {
					throw new BadRequestException(String.format("Cannot extend %s transaction", hiringTransactionEntity.getStatus()));
				}

				// validate timerange
				if (!equipmentDAO.validateEquipmentAvailable(equipment.getId()
						, hiringTransactionEntity.getEndDate().plusDays(1),
						foundAdjustDateRequest.getRequestedEndDate())) {
					throw new BadRequestException("Equipment is not available on requested day!");
				}


				// TODO: 4/13/19 deny all intersected pending transaction

					List<HiringTransactionEntity> pendingTransactionIntersectingWith = hiringTransactionDAO.getPendingTransactionIntersectingWith(
						equipment.getId(),
						hiringTransactionEntity.getEndDate().plusDays(1),
						foundAdjustDateRequest.getRequestedEndDate());


				for (HiringTransactionEntity pendingTransaction : pendingTransactionIntersectingWith) {
					//deny
					pendingTransaction.setStatus(HiringTransactionEntity.Status.DENIED);
					hiringTransactionDAO.merge(pendingTransaction);
				}
				EquipmentEntity managedEquipment = hiringTransactionEntity.getEquipment();
				if (managedEquipment.getStatus() == EquipmentEntity.Status.WAITING_FOR_RETURNING) {
					managedEquipment.setStatus(EquipmentEntity.Status.RENTING);
					equipmentDAO.merge(managedEquipment);
					break;
				}
				hiringTransactionEntity.setEndDate(foundAdjustDateRequest.getRequestedEndDate());
				hiringTransactionDAO.merge(hiringTransactionEntity);
				break;
			case DENIED:
				if (getClaimContractId() != equipment.getContractor().getId()) {
					throw new BadRequestException("Only supplier can deny request for time extension");

				}
				break;
		}


		foundAdjustDateRequest.setStatus(entity.getStatus());

		return Response.ok(transactionDateChangeRequestDAO.merge(foundAdjustDateRequest)).build();
	}
}
