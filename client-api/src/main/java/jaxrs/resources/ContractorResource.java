package jaxrs.resources;

import daos.ConstructionDAO;
import daos.ContractorDAO;
import entities.ContractorEntity;

import javax.inject.Inject;
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


	//todo refactore this bullshit subresource for a better life
	@Inject
	CartRequestResource cartRequestResource;


	@GET
	@Path("{id:\\d+}")
	public Response getContractorById(@PathParam("id") long id) {
		ContractorEntity foundContractor = validateContractorId(id);
		return Response.ok(foundContractor).build();
	}


	@POST
	public Response postContractor(ContractorEntity contractorEntity) {
		contractorEntity.setId(0);

		contractorEntity.setConstructions(null);

		// TODO: 2/16/19 validate shits here


		contractorDao.persist(contractorEntity);
		return Response.status(Response.Status.CREATED).entity(contractorDao.findByID(contractorEntity.getId())).build();
	}


	@PUT
	@Path("{id:\\d+}")
	public Response putContractorById(
			@PathParam("id") long contractorId,
			ContractorEntity contractorEntity) {




		// TODO: 2/16/19 validate shits here

		//validate contractor id
		ContractorEntity foundContractorEntity = validateContractorId(contractorId);


		contractorEntity.setId(contractorId);

		//todo get what needed here
		//no allowed to edit the construction list
		contractorEntity.setConstructions(foundContractorEntity.getConstructions());

		contractorDao.merge(contractorEntity);
		return Response.ok(contractorDao.findByID(contractorEntity.getId())).build();

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
	@Path("{id:\\d+}/equipments")
	public Response getEquipmentsBySupplierId(@PathParam("id") long id) {

		ContractorEntity foundContractor = validateContractorId(id);
		return Response.ok(foundContractor.getEquipments()).build();
	}


	/*============================Cart Service=================*/
//	@GET
//	@Path("{id:\\d+}/cart")
//	public Response getCart(@PathParam("id")long contractorId) {
//		//validate contractor id
//		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
//		if (foundContractor == null) {
//			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
//					String.format("contractor id=%s not found!", contractorId)
//			)).build();
//		}
//
//
//
//	}

	@Path("{id:\\d+}/cart")
	public CartRequestResource toCartResource(@PathParam("id") long contractorId) {
		ContractorEntity foundContractor = validateContractorId(contractorId);
		cartRequestResource.setContractorEntity(foundContractor);
		return cartRequestResource;

	}


}
