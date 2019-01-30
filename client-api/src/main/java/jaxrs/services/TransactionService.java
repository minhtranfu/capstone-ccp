package jaxrs.services;

import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.HiringTransactionDAO;
import dtos.MessageResponse;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import utils.CommonUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("transactions")
@Produces(MediaType.APPLICATION_JSON)
public class TransactionService {

	private static final HiringTransactionDAO hiringTransactionDAO = new HiringTransactionDAO();
	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final ContractorDAO contractorDAO = new ContractorDAO();


	@POST
	public Response requestTransaction(HiringTransactionEntity hiringTransactionEntity) {
		hiringTransactionEntity.setId(0);
		//  check equipment id

		EquipmentEntity foundEquipment = equipmentDAO.findByID(hiringTransactionEntity.getEquipment().getId());
		if (foundEquipment == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Equipment id not found!")).build();
		}


		// check requester id
		ContractorEntity foundRequester = contractorDAO.findByID(hiringTransactionEntity.getRequester().getId());
		if (foundRequester == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Requester id not found!")).build();
		}

		// TODO: 1/30/19 check not null for other data


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

		if (!equipmentDAO.validateEquipmentAvailable(hiringTransactionEntity.getBeginDate()
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


}
