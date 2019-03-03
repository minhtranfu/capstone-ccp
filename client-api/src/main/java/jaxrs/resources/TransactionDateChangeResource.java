package jaxrs.resources;

import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import daos.TransactionDateChangeRequestDAO;
import dtos.responses.MessageResponse;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.List;

public class TransactionDateChangeResource {

	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	TransactionDateChangeRequestDAO transactionDateChangeRequestDAO;

	@Inject
	EquipmentDAO equipmentDAO;

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
	@Path("")
	public Response requestChangingHiringDate(@PathParam("id") long transactionId,
											  TransactionDateChangeRequestEntity transactionDateChangeRequestEntity) {

		//remove id
		transactionDateChangeRequestEntity.setId(0);

		// TODO: 2/10/19 validate authority


		// validate transaction status must be ACCEPTED
		if (hiringTransactionEntity.getStatus() != HiringTransactionEntity.Status.ACCEPTED) {
			throw new BadRequestException("transaction status must be ACCEPTED to adjust date!");
		}


		// validate if there's no other pending requests
		transactionDateChangeRequestDAO.validateOnlyOnePendingRequest(transactionId);


		//leave validateing timerange when contractor approve

		//  1/30/19 set status to pending
		transactionDateChangeRequestEntity.setStatus(TransactionDateChangeRequestEntity.Status.PENDING);

		//set transaction id
		transactionDateChangeRequestEntity.setHiringTransactionEntity(hiringTransactionEntity);
		transactionDateChangeRequestDAO.persist(transactionDateChangeRequestEntity);

		// TODO: 2/10/19 notify to supplier

		return Response.ok(transactionDateChangeRequestDAO.findByID(transactionDateChangeRequestEntity.getId())).build();

	}

	@GET
	@Path("")
	public Response getRequestForChangingHiringDate(@PathParam("id") long transactionId) {
		// TODO: 2/10/19 validate authority


		List<TransactionDateChangeRequestEntity> results = transactionDateChangeRequestDAO.getRequestsByTransactionId(transactionId);
		return Response.ok(results).build();
	}

	@DELETE
	@Path("")
	public Response cancelRequestForChangingHiringDate(@PathParam("id") long transactionId) {
		// TODO: 2/10/19 validate authority


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
	@Path("")
	public Response approveRequestForChangingHiringDate(@PathParam("id") long transactionId
			, TransactionDateChangeRequestEntity entity) {


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
