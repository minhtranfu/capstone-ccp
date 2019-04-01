package jaxrs.resources;

import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import daos.TransactionDateChangeRequestDAO;
import dtos.requests.TransactionDateChangeRequestRequest;
import dtos.responses.MessageResponse;
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
import java.util.List;

@RolesAllowed("contractor")
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

	private HiringTransactionEntity hiringTransactionEntity;

	public TransactionDateChangeResource() {
	}

	public HiringTransactionEntity getHiringTransactionEntity() {
		return hiringTransactionEntity;
	}

	public void setHiringTransactionEntity(HiringTransactionEntity hiringTransactionEntity) {
		this.hiringTransactionEntity = hiringTransactionEntity;
	}

	@POST
	public Response requestChangingHiringDate(@Valid TransactionDateChangeRequestRequest transactionDateChangeRequestRequest) {

		TransactionDateChangeRequestEntity transactionDateChangeRequestEntity = modelConverter.toEntity(transactionDateChangeRequestRequest);

		//set transaction id
		transactionDateChangeRequestEntity.setHiringTransactionEntity(hiringTransactionEntity);

		// 2/10/19 validate authority of requester
		if (hiringTransactionEntity.getRequester().getId() != claimContractorId.getValue().longValue()) {
			throw new BadRequestException(String.format("Contractor id=%d cannot request transaction change of requester id=%d",
					claimContractorId.getValue().longValue(),
					hiringTransactionEntity.getRequester().getId()));
		}

		// validate transaction status must be ACCEPTED
		if (hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.ACCEPTED) {
			throw new BadRequestException("transaction status must be ACCEPTED to adjust date!");
		}


		// validate if there's no other pending requests
		transactionDateChangeRequestDAO.validateOnlyOnePendingRequest(hiringTransactionEntity.getId());


		//leave validateing timerange when contractor approve

		//  1/30/19 set status to pending
		transactionDateChangeRequestEntity.setStatus(TransactionDateChangeRequestEntity.Status.PENDING);

		transactionDateChangeRequestDAO.persist(transactionDateChangeRequestEntity);

		// TODO: 2/10/19 notify to supplier

		return Response.ok(transactionDateChangeRequestDAO.findByID(transactionDateChangeRequestEntity.getId())).build();

	}

	@GET
	public Response getRequestForChangingHiringDate(@QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit,
													@QueryParam("offset") @DefaultValue("0") int offset) {
		//  2/10/19 validate authority
		//supplier or requester is ok
		if (getClaimContractId() != hiringTransactionEntity.getRequester().getId()
				&& getClaimContractId() != hiringTransactionEntity.getEquipment().getContractor().getId()) {
			throw new BadRequestException("Only requester or supplier can see this!");
		}
		List<TransactionDateChangeRequestEntity> results =
				transactionDateChangeRequestDAO.getRequestsByTransactionId(hiringTransactionEntity.getId(), limit, offset);
		return Response.ok(results).build();
	}


	@DELETE
	public Response cancelRequestForChangingHiringDate(@PathParam("id") long transactionId) {
		// 2/10/19 validate authority
		//only requester can cancel this
		if (getClaimContractId() != hiringTransactionEntity.getRequester().getId()) {
			throw new BadRequestException("Only requester can cancel this date request");
		}

		//validate if existing pending requests
		List<TransactionDateChangeRequestEntity> pendingRequestByTransactionId = transactionDateChangeRequestDAO.getPendingRequestByTransactionId(transactionId);
		if (pendingRequestByTransactionId.size() < 1) {
			throw new BadRequestException("No previous PENDING requests to delete!");
		}

		TransactionDateChangeRequestEntity transactionDateChangeRequestEntity = pendingRequestByTransactionId.get(0);
		transactionDateChangeRequestEntity.setIsDeleted(true);
		transactionDateChangeRequestDAO.merge(transactionDateChangeRequestEntity);

		return Response.ok(new MessageResponse("Pending requests deleted successfully!")).build();


	}

	@PUT
	public Response approveRequestForChangingHiringDate(@PathParam("id") long transactionId
			, TransactionDateChangeRequestEntity entity) {

		// TODO: 3/10/19 validate authority
		if (getClaimContractId() != hiringTransactionEntity.getEquipment().getContractor().getId()) {
			throw new BadRequestException("Only supplier can accept or deny date request");

		}
		//validate if existing pending requests
		List<TransactionDateChangeRequestEntity> pendingRequestByTransactionId = transactionDateChangeRequestDAO.getPendingRequestByTransactionId(transactionId);
		if (pendingRequestByTransactionId.size() < 1) {
			throw new BadRequestException("No previous PENDING requests!");
		}

		if (entity.getStatus() == TransactionDateChangeRequestEntity.Status.PENDING) {
			throw new BadRequestException("Status body must not be PENDING");
		}


		TransactionDateChangeRequestEntity foundAdjustDateRequest = pendingRequestByTransactionId.get(0);


		// validate timerange
		if (!equipmentDAO.validateEquipmentAvailable(hiringTransactionEntity.getEquipment().getId()
				, foundAdjustDateRequest.getRequestedBeginDate(),
				foundAdjustDateRequest.getRequestedEndDate())) {
			throw new BadRequestException("Equipment is not available on requested day!");
		}

		foundAdjustDateRequest.setStatus(entity.getStatus());
		transactionDateChangeRequestDAO.merge(foundAdjustDateRequest);
		return Response.ok(foundAdjustDateRequest).build();
	}
}
