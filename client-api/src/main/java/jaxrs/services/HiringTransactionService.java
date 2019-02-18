package jaxrs.services;

import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import daos.TransactionDateChangeRequestDAO;
import dtos.requests.HiringTransactionRequest;
import dtos.responses.MessageResponse;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;
import utils.Constants;

import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("transactions")
@Produces(MediaType.APPLICATION_JSON)
public class HiringTransactionService {

	private static final HiringTransactionDAO hiringTransactionDAO = new HiringTransactionDAO();
	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final ContractorDAO contractorDAO = new ContractorDAO();
	private static final TransactionDateChangeRequestDAO transactionDateChangeRequestDAO = new TransactionDateChangeRequestDAO();


	@POST
	public Response requestTransaction(@Valid HiringTransactionRequest hiringTransactionRequest) {


		//  check equipment id
		EquipmentEntity foundEquipment = equipmentDAO.findByID(hiringTransactionRequest.getEquipmentId());
		if (foundEquipment == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Equipment id not found!")).build();
		}

		// TODO: 2/17/19 map this properly with modelmapper
		HiringTransactionEntity hiringTransactionEntity = new HiringTransactionEntity(
				hiringTransactionRequest, foundEquipment
		);


		ContractorEntity contractorEntity = new ContractorEntity();
		// TODO: 2/17/19 get requester id from cookie
		contractorEntity.setId(Constants.CURRENT_USER_PROFILE);

		hiringTransactionEntity.setRequester(contractorEntity);


		//already checked by DTO validation
//		if (hiringTransactionEntity.getBeginDate() == null || hiringTransactionEntity.getEndDate() == null) {
//			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Date is missing!")).build();
//
//		}
		// TODO: 1/30/19 check not null for other data


		// check requester id
		ContractorEntity foundRequester = contractorDAO.findByID(hiringTransactionEntity.getRequester().getId());
		if (foundRequester == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Requester id not found!")).build();
		}


		//validate begindate enddate
		if (hiringTransactionEntity.getBeginDate().after(hiringTransactionEntity.getEndDate())) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("beginDate>endDate")).build();
		}

		//  1/30/19 check requester activation
		if (!foundRequester.isActivated()) {
			return Response.status((Response.Status.BAD_REQUEST)).entity(new MessageResponse("Requester is not activated!")).build();
		}
		//  1/30/19 set equipment location from equipment id

		if (
				foundEquipment.getAddress() == null
						||
						foundEquipment.getAddress().isEmpty()
						||
						foundEquipment.getLongitude() == null
						|| foundEquipment.getLatitude() == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("equipment id=%d location data not completed", foundEquipment.getId()))).build();
		}
		hiringTransactionEntity.setEquipmentAddress(foundEquipment.getAddress());
		hiringTransactionEntity.setEquipmentLongitude(foundEquipment.getLongitude());
		hiringTransactionEntity.setEquipmentLatitude(foundEquipment.getLatitude());


		// todo  1/30/19 validate equipment is available at that date
		if (!equipmentDAO.validateEquipmentAvailable(
				foundEquipment.getId(),
				hiringTransactionEntity.getBeginDate()
				, hiringTransactionEntity.getEndDate())) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new
					MessageResponse("equipment not available on that date!")).build();
		}


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
		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByID(id);
		if (foundTransaction == null) {
			return Response.status(Response.Status.NOT_FOUND).entity(new MessageResponse("id not found!")).build();
		}
		return Response.ok(foundTransaction).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	public Response cancelTransaction(@PathParam("id") long id) {
		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByID(id);
		if (foundTransaction == null) {
			return Response.status(Response.Status.NOT_FOUND).entity(new MessageResponse("id not found!")).build();
		}


		foundTransaction.setDeleted(true);
		hiringTransactionDAO.merge(foundTransaction);

		return Response.status(Response.Status.OK).entity(new MessageResponse("Transaction deleted!")).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateTransactionStatus(@PathParam("id") long id, HiringTransactionEntity transactionEntity) {

		// TODO: 2/9/19 if approved, auto deny all intersected requests


		HiringTransactionEntity foundTransaction = hiringTransactionDAO.findByID(id);
		if (foundTransaction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("id not found!")).build();
		}

		if (transactionEntity.getStatus() == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Status is null!")).build();
		}


		EquipmentEntity foundEquipment = foundTransaction.getEquipment();
		switch (transactionEntity.getStatus()) {
			case PENDING:
				//validate
				if (foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}
				break;
			case ACCEPTED:
				//validate

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}

				break;
			case DENIED:
				//validate

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}
				break;
			case PROCESSING:
				//validate

				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}


				// TODO: 2/18/19 validate there'are no processing transaction related to equipment
				List<HiringTransactionEntity> processingTransactionsByEquipmentId = hiringTransactionDAO.getProcessingTransactionsByEquipmentId(foundEquipment.getId());
				if (processingTransactionsByEquipmentId.size() > 0) {
					if (processingTransactionsByEquipmentId.size() == 1) {
						return Response.status(Response.Status.BAD_REQUEST).entity(
								new MessageResponse(String.format("Equipment id=%d already have processing transaction id=%d"
										, foundEquipment.getId()
										, processingTransactionsByEquipmentId.get(0).getId()))
						).build();
					} else {
						return Response.status(Response.Status.BAD_REQUEST).entity(
								new MessageResponse(String.format("Severe: there are more than 1 processing transaction for equipment id=%s",
										foundEquipment.getId()))
						).build();
					}
				}

				// TODO: 2/18/19 validate equipment status must be available
				if (foundEquipment.getStatus() != EquipmentEntity.Status.AVAILABLE) {
					return Response.status(Response.Status.BAD_REQUEST).entity(
							new MessageResponse(String.format("Equipment id=%d status must be AVAILABLE to process transaction", foundEquipment.getId()))
					).build();
				}
				//change transaction status to PROCESSING

				//todo change equipment status to delivering
				foundEquipment.setStatus(EquipmentEntity.Status.DELIVERING);
				equipmentDAO.merge(foundEquipment);

				break;
			case CANCELED:
				//validate
				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PROCESSING
						&& foundTransaction.getStatus() != HiringTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}
				break;
			case FINISHED:
				//validate
				if (foundTransaction.getStatus() != HiringTransactionEntity.Status.PROCESSING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Cannot change from %s to %s",
									foundTransaction.getStatus(), transactionEntity.getStatus()))).build();

				}
				// TODO: 2/18/19 check equipment status must be WAITING_FOR_RETURNING
				if (foundEquipment.getStatus() != EquipmentEntity.Status.WAITING_FOR_RETURNING) {
					return Response.status(Response.Status.BAD_REQUEST)
							.entity(new MessageResponse(String.format("Equipment id=%d status must be WAITING_FOR_RETURNING to finish transaction",
									foundEquipment.getId()))).build();
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
	public Response getReceivedTransactionAsSupplier(@PathParam("id") long supplierId) {


		//validate supplierId
		ContractorEntity foundContractor = contractorDAO.findByID(supplierId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("supplier id not found!")).build();
		}

		List<HiringTransactionEntity> hiringTransactionsBySupplierId = hiringTransactionDAO.getHiringTransactionsBySupplierId(supplierId);

		return Response.ok(hiringTransactionsBySupplierId).build();

	}


	@GET
	@Path("requester/{id:\\d+}")
	public Response getSentTransactionsAsRequester(@PathParam("id") long requesterId) {
		ContractorEntity foundContractor = contractorDAO.findByID(requesterId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("requester id not found!")).build();
		}

		List<HiringTransactionEntity> transactionsByRequesterId = hiringTransactionDAO.getHiringTransactionsByRequesterId(requesterId);

		return Response.ok(transactionsByRequesterId).build();
	}

	@POST
	@Path("{id:\\d+}/adjustDateRequests")
	public Response requestChangingHiringDate(@PathParam("id") long transactionId,
											  TransactionDateChangeRequestEntity transactionDateChangeRequestEntity) {

		//remove id
		transactionDateChangeRequestEntity.setId(0);

		// TODO: 2/10/19 validate authority


		// validate transaction id

		HiringTransactionEntity transactionEntity = hiringTransactionDAO.findByID(transactionId);
		if (transactionEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("transaction id not found!")).build();
		}

		// validate transaction status must be ACCEPTED
		if (transactionEntity.getStatus() != HiringTransactionEntity.Status.ACCEPTED) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("transaction status must be ACCEPTED to adjust date!")).build();

		}
		// validate if there's no other pending requests

		boolean isValidated = transactionDateChangeRequestDAO.validateNewRequest(transactionId);

		if (!isValidated) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("this transaction already has another pending requests!")).build();
		}


		//leave validateing timerange when contractor approve

		//  1/30/19 set status to pending
		transactionDateChangeRequestEntity.setStatus(TransactionDateChangeRequestEntity.Status.PENDING);

		//set transaction id
		transactionDateChangeRequestEntity.setHiringTransactionEntity(transactionEntity);
		transactionDateChangeRequestDAO.persist(transactionDateChangeRequestEntity);

		// TODO: 2/10/19 notify to supplier


		return Response.ok(transactionDateChangeRequestDAO.findByID(transactionDateChangeRequestEntity.getId())).build();

	}

	@GET
	@Path("{id:\\d+}/adjustDateRequests")
	public Response getRequestForChangingHiringDate(@PathParam("id") long transactionId) {
		// TODO: 2/10/19 validate authority


		// validate transaction id

		HiringTransactionEntity transactionEntity = hiringTransactionDAO.findByID(transactionId);
		if (transactionEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("transaction id not found!")).build();
		}

		List<TransactionDateChangeRequestEntity> results = transactionDateChangeRequestDAO.getRequestsByTransactionId(transactionId);
		return Response.ok(results).build();
	}

	@DELETE
	@Path("{id:\\d+}/adjustDateRequests")
	public Response cancelRequestForChangingHiringDate(@PathParam("id") long transactionId) {
		// TODO: 2/10/19 validate authority


		// validate transaction id

		HiringTransactionEntity foundHiringTransaction = hiringTransactionDAO.findByID(transactionId);
		if (foundHiringTransaction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("transaction id not found!")).build();
		}

//		TransactionDateChangeRequestEntity foundAdjustDateRequest = transactionDateChangeRequestDAO.findByID(requestId);
//		if (foundAdjustDateRequest == null) {
//			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Request Id not found!")).build();
//		}
//
//		if (foundAdjustDateRequest.getStatus() != TransactionDateChangeRequestEntity.Status.PENDING) {
//			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Request status is not PENDING!")).build();
//		}
//
//		foundAdjustDateRequest.setIsDeleted(true);
//		transactionDateChangeRequestDAO.merge(foundAdjustDateRequest);

		//validate if existing pending requests
		List<TransactionDateChangeRequestEntity> pendingRequestByTransactionId = transactionDateChangeRequestDAO.getPendingRequestByTransactionId(transactionId);
		if (pendingRequestByTransactionId.size() < 1) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("No previous PENDING requests to delete!")).build();
		}

		TransactionDateChangeRequestEntity transactionDateChangeRequestEntity = pendingRequestByTransactionId.get(0);
		transactionDateChangeRequestEntity.setIsDeleted(true);
		transactionDateChangeRequestDAO.merge(transactionDateChangeRequestEntity);

		return Response.ok(new MessageResponse("Pending requests deleted successfully!")).build();


	}

	@PUT
	@Path("{id:\\d+}/adjustDateRequests")
	public Response approveRequestForChangingHiringDate(@PathParam("id") long transactionId
			, TransactionDateChangeRequestEntity entity) {
		HiringTransactionEntity foundHiringTransaction = hiringTransactionDAO.findByID(transactionId);
		if (foundHiringTransaction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("transaction id not found!")).build();
		}

		//validate if existing pending requests
		List<TransactionDateChangeRequestEntity> pendingRequestByTransactionId = transactionDateChangeRequestDAO.getPendingRequestByTransactionId(transactionId);
		if (pendingRequestByTransactionId.size() < 1) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("No previous PENDING requests!")).build();
		}

		if (entity.getStatus() == TransactionDateChangeRequestEntity.Status.PENDING) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Status body must not be PENDING")).build();

		}


		TransactionDateChangeRequestEntity foundAdjustDateRequest = pendingRequestByTransactionId.get(0);
		//todo validate timerange

		if (!equipmentDAO.validateEquipmentAvailable(foundHiringTransaction.getEquipment().getId()
				, foundAdjustDateRequest.getRequestedBeginDate(),
				foundAdjustDateRequest.getRequestedEndDate())) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Equipment is not available on requested day!")).build();

		}

		foundAdjustDateRequest.setStatus(entity.getStatus());
		transactionDateChangeRequestDAO.merge(foundAdjustDateRequest);
		return Response.ok(foundAdjustDateRequest).build();
	}


}
