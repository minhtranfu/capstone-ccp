package jaxrs.services;


import daos.CartRequestDAO;
import daos.ContractorDAO;
import dtos.responses.MessageResponse;
import entities.CartRequestEntity;
import entities.ContractorEntity;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Produces(MediaType.APPLICATION_JSON)
public class CartRequestResource {

	public static final CartRequestDAO cartRequestDao = new CartRequestDAO();
	public static final ContractorDAO contractorDao = new ContractorDAO();


	long contractorId;


	public CartRequestResource(long contractorId) {
		this.contractorId = contractorId;
	}

	private Response validateContractorId(long contractorId) {
		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return javax.ws.rs.core.Response.status(javax.ws.rs.core.Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
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






}
