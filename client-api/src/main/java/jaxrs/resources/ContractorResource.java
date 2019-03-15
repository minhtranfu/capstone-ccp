package jaxrs.resources;

import daos.ConstructionDAO;
import daos.ContractorDAO;
import dtos.requests.ContractorRequest;
import entities.ContractorEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.eclipse.microprofile.jwt.JsonWebToken;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.inject.Provider;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("contractors")
@Produces(MediaType.APPLICATION_JSON)
public class ContractorResource {

	@Inject
	ContractorDAO contractorDao;

	@Inject
	ConstructionDAO constructionDao;

	@Inject
	ConstructionResource constructionResource;
	@Inject
	CartRequestResource cartRequestResource;
	@Inject
	NotificationDeviceTokenResource notificationDeviceTokenResource;

	@Inject
	ModelConverter modelConverter;


	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimId;

	@GET
	@Path("{id:\\d+}")
	public Response getContractorById(@PathParam("id") long id) {


		ContractorEntity foundContractor = validateContractorId(id);
		return Response.ok(foundContractor).build();
	}


	@RolesAllowed("contractor")
	@POST
	public Response postContractor(ContractorRequest contractorRequest) {

		ContractorEntity contractorEntity = modelConverter.toEntity(contractorRequest);
		contractorDao.persist(contractorEntity);
		return Response.status(Response.Status.CREATED).entity(contractorDao.findByID(contractorEntity.getId())).build();
	}


	@PUT
	@RolesAllowed("contractor")
	@Path("{id:\\d+}")
	public Response putContractorById(
			@PathParam("id") long contractorId,
			@Valid @NotNull ContractorRequest contractorRequest) {

		//validate contractorid = claimid
		if (contractorId != claimId.getValue().longValue()) {
			throw new BadRequestException("You cannot edit other people's profile");
		}

		//validate contractor id
		ContractorEntity foundContractorEntity = validateContractorId(contractorId);

		modelConverter.toEntity(contractorRequest, foundContractorEntity);

		return Response.ok(contractorDao.merge(foundContractorEntity)).build();

	}


	@Path("{id:\\d+}/constructions")
	public ConstructionResource toConstructionResource(
			@PathParam("id") long contractorId
	) {
		// TODO: 3/1/19 validate contractor id
		ContractorEntity foundContractor = validateContractorId(contractorId);
		constructionResource.setContractorEntity(foundContractor);
		return constructionResource;
	}


	private ContractorEntity validateContractorId(long contractorId) {
		return contractorDao.findByIdWithValidation(contractorId);
	}

	@GET
	@RolesAllowed("contractor")
	@Path("{id:\\d+}/equipments")
	public Response getEquipmentsBySupplierId(@PathParam("id") long id) {

		ContractorEntity foundContractor = validateContractorId(id);
		return Response.ok(foundContractor.getEquipments()).build();
	}


	@Path("{id:\\d+}/cart")
	public CartRequestResource toCartResource(@PathParam("id") long contractorId) {
		ContractorEntity foundContractor = validateContractorId(contractorId);
		cartRequestResource.setContractorEntity(foundContractor);
		return cartRequestResource;

	}

//	@Path("{id:\\d+}/notifications")
//	public NotificationDeviceTokenResource toNotificationDeviceTokenResource(@PathParam("id") long contractorId) {
//		ContractorEntity foundContractor = validateContractorId(contractorId);
//		notificationDeviceTokenResource.setContractorEntity(foundContractor);
//		return notificationDeviceTokenResource;
//
//	}


}
