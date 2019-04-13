package jaxrs.resources;


import daos.CartRequestDAO;
import daos.EquipmentDAO;
import dtos.requests.HiringTransactionRequest;
import entities.CartRequestEntity;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import jaxrs.validators.HiringTransactionValidator;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("contractor")
@Stateless
public class CartRequestResource {

	@Inject
	CartRequestDAO cartRequestDao;

	@Inject
	EquipmentDAO equipmentDao;

	@Inject
	HiringTransactionValidator hiringTransactionValidator;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimId;

	@Inject
	ModelConverter modelConverter;

	public CartRequestResource() {
	}

	private ContractorEntity contractorEntity;

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

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's cart");
		}

		// 3/3/19 model mapper
		HiringTransactionRequest hiringTransactionRequest = modelConverter.toRequest(cartRequestEntity);
		hiringTransactionRequest.setRequesterId(contractorEntity.getId());
		hiringTransactionValidator.validateHiringTransactionRequestBeforeSend(hiringTransactionRequest);

		cartRequestEntity.setContractor(contractorEntity);
		cartRequestDao.persist(cartRequestEntity);
		return Response.status(Response.Status.CREATED)
				.entity(cartRequestDao.findByID(cartRequestEntity.getId())).build();
	}

	@PUT
	@Path("{cartRequestId:\\d+}")
	public Response putCartRequestItem(
			@PathParam("cartRequestId") long cartRequestId
			,@Valid CartRequestEntity cartRequestEntity) {

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}

		cartRequestEntity.setId(cartRequestId);

		equipmentDao.findByIdWithValidation(cartRequestEntity.getEquipment().getId());

		cartRequestEntity.setContractor(contractorEntity);
		CartRequestEntity merged = cartRequestDao.merge(cartRequestEntity);

		return Response.ok(merged).build();
	}

	@DELETE
	@Path("{cartRequestId:\\d+}")
	public Response deleteCartRequest(@PathParam("cartRequestId") long cartRequestId) {


		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}

		CartRequestEntity foundCartRequest = validateCartRequestId(cartRequestId);

		//not soft delete
		cartRequestDao.delete(foundCartRequest);
		return Response.ok().build();
	}


	// TODO: 2/20/19 send a request from cart
	@POST
	@Path("send")
	public Response sendAllRequestFromCart() {

		if (contractorEntity.getId() != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's construction");
		}
		cartRequestDao.transferFromCartToTransaction(contractorEntity.getId());
		return Response.ok().build();
	}

}
