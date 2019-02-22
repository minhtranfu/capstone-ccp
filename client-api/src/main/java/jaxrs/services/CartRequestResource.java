package jaxrs.services;


import daos.CartRequestDAO;
import daos.ContractorDAO;
import daos.EquipmentDAO;
import dtos.responses.MessageResponse;
import entities.CartRequestEntity;
import entities.ContractorEntity;
import entities.EquipmentEntity;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
public class CartRequestResource {

	public static final CartRequestDAO cartRequestDao = new CartRequestDAO();
	public static final ContractorDAO contractorDao = new ContractorDAO();
	public static final EquipmentDAO equipmentDao = new EquipmentDAO();


	long contractorId;


	public CartRequestResource(long contractorId) {
		this.contractorId = contractorId;
	}

	private Response validateContractorId(long contractorId) {
		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}
		return null;
	}

	private Response validateEquipmentId(long equipmentId) {
		//validate equipment id
		EquipmentEntity foundEquipment = equipmentDao.findByID(equipmentId);

		if (foundEquipment == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("equipment id=%s not found!", equipmentId)
			)).build();
		}
		return null;
	}

	private Response validateCartRequestId(long cartRequestId) {
		CartRequestEntity foundCartRequestEntity = cartRequestDao.findByID(cartRequestId);
		if (foundCartRequestEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST)
					.entity(new MessageResponse(
							String.format("cartRequestId =%s not found", cartRequestId)
					)).build();
		}
		return null;
	}

	@GET
	public Response getCart() {
		Response validateResult = validateContractorId(contractorId);
		if (validateResult != null) {
			return validateResult;
		}


		List<CartRequestEntity> cartRequestList = cartRequestDao.getCartByContractorId(contractorId);
		return Response.ok(cartRequestList).build();
	}


	@POST
	public Response addToCart(CartRequestEntity cartRequestEntity) {

		//todo check null fields


		//validate contractor id
		Response validateResult = validateContractorId(contractorId);
		if (validateResult != null) {
			return validateResult;
		}

		//check equipment not null
		if (cartRequestEntity.getEquipment() == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse("Equipment id must not null")
			).build();

		}
		validateResult = validateEquipmentId(cartRequestEntity.getEquipment().getId());
		if (validateResult != null) {
			return validateResult;
		}


		cartRequestEntity.setId(0);
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		cartRequestEntity.setContractor(foundContractor);


		cartRequestDao.persist(cartRequestEntity);
		return Response.status(Response.Status.CREATED)
				.entity(cartRequestDao.findByID(cartRequestEntity.getId())).build();
	}

	@PUT
	@Path("{cartRequestId:\\d+}")
	public Response putCartRequestItem(
			@PathParam("cartRequestId") long cartRequestId
			, CartRequestEntity cartRequestEntity) {

		cartRequestEntity.setId(cartRequestId);


		Response validateResult = validateCartRequestId(cartRequestId);
		if (validateResult != null) {
			return validateResult;
		}
		validateResult = validateContractorId(contractorId);
		if (validateResult != null) {
			return validateResult;
		}

		validateResult = validateEquipmentId(cartRequestEntity.getEquipment().getId());
		if (validateResult != null) {
			return validateResult;
		}

		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		cartRequestEntity.setContractor(foundContractor);

		cartRequestDao.merge(cartRequestEntity);
		return Response.ok(cartRequestDao.findByID(cartRequestId)).build();
	}

	@DELETE
	@Path("{cartRequestId:\\d+}")
	public Response deleteCartRequest(@PathParam("cartRequestId") long cartRequestId) {

		Response validateResult = validateCartRequestId(cartRequestId);
		if (validateResult != null) {
			return validateResult;
		}
		validateResult = validateContractorId(contractorId);
		if (validateResult != null) {
			return validateResult;
		}


		CartRequestEntity foundCartRequestEntity = cartRequestDao.findByID(cartRequestId);
		cartRequestDao.delete(foundCartRequestEntity);
		return Response.ok().build();
	}


//	@POST
//	@Path("send")
//	public Response sendAllRequestFromCart() {
//		Response validateResult = validateContractorId(contractorId);
//		if (validateResult != null) {
//			return validateResult;
//		}
//
//		List<CartRequestEntity> cartRequestEntityList = cartRequestDao.getCartByContractorId(contractorId);
//
//	}

}