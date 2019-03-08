package jaxrs.resources;


import daos.CartRequestDAO;
import daos.EquipmentDAO;
import dtos.requests.HiringTransactionRequest;
import entities.CartRequestEntity;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import jaxrs.validators.HiringTransactionValidator;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("contractor")
public class CartRequestResource {

	@Inject
	CartRequestDAO cartRequestDao;

	@Inject
	EquipmentDAO equipmentDao;

	@Inject
	HiringTransactionValidator hiringTransactionValidator;

	public CartRequestResource() {
	}

	ContractorEntity contractorEntity;

	public ContractorEntity getContractorEntity() {
		return contractorEntity;
	}

	public void setContractorEntity(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}


	private EquipmentEntity validateEquipmentId(long equipmentId) {
		//validate equipment id
		EquipmentEntity foundEquipment = equipmentDao.findByID(equipmentId);

		if (foundEquipment == null) {
			throw new NotFoundException(String.format("equipment id=%s not found!", equipmentId));
		}
		return foundEquipment;
	}


	private CartRequestEntity validateCartRequestId(long cartRequestId) {
		return cartRequestDao.findByIdWithValidation(cartRequestId);
	}

	@GET
	public Response getCart() {
		List<CartRequestEntity> cartRequestList = cartRequestDao.getCartByContractorId(contractorEntity.getId());
		return Response.ok(cartRequestList).build();
	}


	@GET
	@Path("{cartId:\\d+}")
	public Response getCartById(@PathParam("cartId") long cartId) {
		return Response.ok(cartRequestDao.findByIdWithValidation(cartId)).build();
	}

	@POST
	public Response addToCart(@Valid CartRequestEntity cartRequestEntity) {


		HiringTransactionRequest hiringTransactionRequest = new HiringTransactionRequest(
				cartRequestEntity.getBeginDate(),
				cartRequestEntity.getEndDate(),
				cartRequestEntity.getRequesterAddress(),
				cartRequestEntity.getRequesterLat(),
				cartRequestEntity.getRequesterLong(),
				cartRequestEntity.getEquipment().getId(),
				contractorEntity.getId()
		);

		hiringTransactionValidator.validateAddHiringTransaction(hiringTransactionRequest);

		// TODO: 3/3/19 model mapper

		cartRequestDao.persist(cartRequestEntity);
		return Response.status(Response.Status.CREATED)
				.entity(cartRequestDao.findByID(cartRequestEntity.getId())).build();
	}

	@PUT
	@Path("{cartRequestId:\\d+}")
	public Response putCartRequestItem(
			@PathParam("cartRequestId") long cartRequestId
			,@Valid CartRequestEntity cartRequestEntity) {

		cartRequestEntity.setId(cartRequestId);

		equipmentDao.findByIdWithValidation(cartRequestEntity.getEquipment().getId());

		cartRequestEntity.setContractor(contractorEntity);
		CartRequestEntity merged = cartRequestDao.merge(cartRequestEntity);

		return Response.ok(merged).build();
	}

	@DELETE
	@Path("{cartRequestId:\\d+}")
	public Response deleteCartRequest(@PathParam("cartRequestId") long cartRequestId) {

		CartRequestEntity foundCartRequest = validateCartRequestId(cartRequestId);

		//not soft delete
		cartRequestDao.delete(foundCartRequest);
		return Response.ok().build();
	}


	// TODO: 2/20/19 send all request from cart
	@POST
	@Path("send")
	public Response sendAllRequestFromCart() {

		cartRequestDao.transferFromCartToTransaction(contractorEntity.getId());
		return Response.ok().build();
	}

}
