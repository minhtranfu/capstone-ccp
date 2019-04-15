package jaxrs.resources;

import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import daos.TransactionDateChangeRequestDAO;
import dtos.requests.HiringTransactionRequest;
import dtos.responses.MessageResponse;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import jaxrs.validators.HiringTransactionValidator;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("transactions")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("contractor")

public class HiringTransactionResource {

	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	public EquipmentDAO equipmentDAO;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	TransactionDateChangeRequestDAO transactionDateChangeRequestDAO;

	@Inject
	HiringTransactionValidator validator;


	@Inject
	TransactionDateChangeResource transactionDateChangeResource;
	@Inject
	ModelConverter modelConverter;


	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@POST
	public Response requestTransaction(@Valid HiringTransactionRequest hiringTransactionRequest) {


		//3/10/19 get requester id from token
		hiringTransactionRequest.setRequesterId(claimContractorId.getValue().longValue());
		validator.validateHiringTransactionRequestBeforeSend(hiringTransactionRequest);
		HiringTransactionEntity hiringTransactionEntity = modelConverter.toEntity(hiringTransactionRequest);


		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(hiringTransactionEntity.getEquipment().getId());

		hiringTransactionEntity.setEquipmentAddress(foundEquipment.getFinalAddress());
		hiringTransactionEntity.setEquipmentLongitude(foundEquipment.getFinalLongitude());
		hiringTransactionEntity.setEquipmentLatitude(foundEquipment.getFinalLatitude());

		hiringTransactionEntity.setDailyPrice(foundEquipment.getDailyPrice());

		//  1/30/19 set status to pending
		hiringTransactionEntity.setStatus(HiringTransactionEntity.Status.PENDING);

		hiringTransactionDAO.persist(hiringTransactionEntity);
		return Response.status(Response.Status.CREATED).entity(
				hiringTransactionDAO.findByID(hiringTransactionEntity.getId())
		).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getTransaction(@PathParam("id") long id) {

		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByIdWithValidation(id);
		return Response.ok(foundTransaction).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	public Response cancelTransaction(@PathParam("id") long id) {
		// TODO: 3/10/19 validate authority for requester

		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByIdWithValidation(id);
		if (getClaimContractorId() != foundTransaction.getRequester().getId()) {
			throw new BadRequestException("Only requester can cancel request");
		}

		if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING) {
			throw new BadRequestException("You can only cancel PENDING transaction");
		}

		foundTransaction.setDeleted(true);
		hiringTransactionDAO.merge(foundTransaction);

		return Response.status(Response.Status.OK).entity(new MessageResponse("Transaction deleted!")).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateTransactionStatus(@PathParam("id") long id, HiringTransactionEntity transactionEntity) {

		// TODO: 3/10/19 validate authority

		// TODO: 2/9/19 if approved, auto deny all intersected requests

		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByIdWithValidation(id);


		//todo not validate authority for ease

		if (transactionEntity.getStatus() == null) {
			throw new BadRequestException("Status is null!");
		}

		EquipmentEntity foundEquipment = foundTransaction.getEquipment();
		ContractorEntity foundContractor = foundEquipment.getContractor();
		switch (transactionEntity.getStatus()) {
			case PENDING:
				//  4/3/19 validate if active
				if (!foundContractor.isActivated()) {
					throw new BadRequestException(String.format("Supplier %s is %s",
							foundContractor.getName(), foundContractor.getStatus().getBeautifiedName()));
				}

				//validate
				if (foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));

				}
				break;
			case ACCEPTED:
				//validate

				//  4/3/19 validate if active
				if (!foundContractor.isActivated()) {
					throw new BadRequestException(String.format("Supplier %s is %s",
							foundContractor.getName(), foundContractor.getStatus().getBeautifiedName()));
				}

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));

				}
				// deny other pending requests that intersect with this accepted transaction

				List<HiringTransactionEntity> pendingTransactionIntersectingWith = hiringTransactionDAO.getPendingTransactionIntersectingWith(
						foundEquipment.getId(),
						foundTransaction.getBeginDate(),
						foundTransaction.getEndDate());

				for (HiringTransactionEntity pendingTransaction : pendingTransactionIntersectingWith) {
					//deny
					if (pendingTransaction.getId() != foundTransaction.getId()) {
						pendingTransaction.setStatus(HiringTransactionEntity.Status.DENIED);
						hiringTransactionDAO.merge(pendingTransaction);
					}
				}

				break;
			case DENIED:
				//validate

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));


				}
				break;
			case PROCESSING:
				//validate

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));


				}


				//  2/18/19 validate there'are no processing transaction related to equipment
				List<HiringTransactionEntity> processingTransactionsByEquipmentId = hiringTransactionDAO.getProcessingTransactionsByEquipmentId(foundEquipment.getId());
				if (processingTransactionsByEquipmentId.size() > 0) {
					if (processingTransactionsByEquipmentId.size() == 1) {

						throw new BadRequestException(String.format("Equipment id=%d already have processing transaction id=%d"
								, foundEquipment.getId()
								, processingTransactionsByEquipmentId.get(0).getId()));
					} else {
						throw new BadRequestException(String.format("Severe: there are more than 1 processing transaction for equipment id=%s",
								foundEquipment.getId()));
					}
				}

				// 2/18/19 validate equipment status must be available
				if (foundEquipment.getStatus() != EquipmentEntity.Status.AVAILABLE) {
					throw new BadRequestException(String.format("Equipment id=%d status must be AVAILABLE to process transaction", foundEquipment.getId()));
				}
				//change transaction status to PROCESSING

				//todo change equipment status to delivering
				foundEquipment.setStatus(EquipmentEntity.Status.DELIVERING);
				equipmentDAO.merge(foundEquipment);

				break;
			case CANCELED:
				//validate
				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.ACCEPTED
				&& foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}

				foundTransaction.setCancelReason(transactionEntity.getCancelReason());
				//canceledBy
				ContractorEntity canceledBy = new ContractorEntity();
				canceledBy.setId(getClaimContractorId());
				foundTransaction.setCanceledBy(canceledBy);

				break;
			case FINISHED:
				//validate
				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PROCESSING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {

					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}
				// TODO: 2/18/19 check equipment status must be WAITING_FOR_RETURNING
				if (foundEquipment.getStatus() != EquipmentEntity.Status.WAITING_FOR_RETURNING) {
					throw new BadRequestException(String.format("Equipment id=%d status must be WAITING_FOR_RETURNING to finish transaction",
							foundEquipment.getId()));
				}

				// TODO: 2/18/19 change equipment status to AVAILABLE
				foundEquipment.setStatus(EquipmentEntity.Status.AVAILABLE);
				equipmentDAO.merge(foundEquipment);
				break;

		}


		foundTransaction.setStatus(transactionEntity.getStatus());
		hiringTransactionDAO.merge(foundTransaction);
		return Response.status(Response.Status.OK).entity(hiringTransactionDAO.findByID(id)).build();
	}

	@GET
	@Path("supplier/{id:\\d+}")
	public Response getReceivedTransactionAsSupplier(
			@PathParam("id") long supplierId
			, @QueryParam("status") HiringTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		//2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		if (supplierId != claimContractorId.getValue().longValue()) {
			throw new BadRequestException("You cannot view other people's transaction");
		}


		//validate supplierId
		contractorDAO.findByIdWithValidation(supplierId);

		return Response.ok(hiringTransactionDAO.getHiringTransactionsBySupplierId(supplierId, status, limit, offset, orderBy)).build();

	}


	@GET
	@Path("requester/{id:\\d+}")
	public Response getSentTransactionsAsRequester(
			@PathParam("id") long requesterId
			, @QueryParam("status") HiringTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		//2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		if (requesterId != claimContractorId.getValue().longValue()) {
			throw new BadRequestException("You cannot view other people's transaction");
		}

		ContractorEntity foundContractor = contractorDAO.findByID(requesterId);
		if (foundContractor == null) {
			//custom message for requester not contractor
			throw new BadRequestException(String.format("requester id=%s not found!", requesterId));
		}
		return Response.ok(hiringTransactionDAO.getHiringTransactionsByRequesterId
				(requesterId, status, limit, offset, orderBy)).build();
	}


//	@Path("{id:\\d+}/transactionDateChangeRequests")
//	public TransactionDateChangeResource toTransactionDateChangeResource(@PathParam("id") long transactionId) {
//
//
//		HiringTransactionEntity transactionEntity = validateHiringTransactionEntity(transactionId);
//
//		transactionDateChangeResource.setHiringTransactionEntity(transactionEntity);
//		return transactionDateChangeResource;
//	}

	private HiringTransactionEntity validateHiringTransactionEntity(long transactionId) {
		HiringTransactionEntity transactionEntity = hiringTransactionDAO.findByID(transactionId);

		if (transactionEntity == null) {
			throw new BadRequestException(String.format("transaction id = %d not found!", transactionId));
		}
		return transactionEntity;
	}


}
