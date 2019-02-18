package jaxrs.services;

import daos.ConstructionDAO;
import daos.ContractorDAO;
import dtos.responses.MessageResponse;
import entities.ConstructionEntity;
import entities.ContractorEntity;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("contractors")
@Produces(MediaType.APPLICATION_JSON)
public class ContractorService {

	private static final ContractorDAO contractorDao = new ContractorDAO();
	private static final ConstructionDAO constructionDao = new ConstructionDAO();

	@GET
	@Path("{id:\\d+}")
	public Response getContractorById(@PathParam("id") long id) {
		ContractorEntity foundContractor = contractorDao.findByID(id);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", id)
			)).build();
		}
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
			@PathParam("id") long constractorId,
			ContractorEntity contractorEntity) {


		contractorEntity.setId(constractorId);
		contractorEntity.setConstructions(null);


		// TODO: 2/16/19 validate shits here

		//validate contractor id
		ContractorEntity foundContractorEntity = contractorDao.findByID(constractorId);
		if (foundContractorEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", constractorId)
			)).build();
		}


		contractorDao.merge(contractorEntity);
		return Response.ok(contractorDao.findByID(contractorEntity.getId())).build();

	}


	@GET
	@Path("{id:\\d+}/constructions")
	public Response getConstructionsByContractorId(
			@PathParam("id") long contractorId
	) {


		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}

		return Response.ok(foundContractor.getConstructions()).build();
	}


	@GET
	@Path("{id:\\d+}/constructions/{constructionId:\\d+}")
	public Response getConstructionByConstructionId(
			@PathParam("id") long contractorId,
			@PathParam("constructionId") long constructionId
	) {

		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}

		//validate construction id
		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		if (foundConstruction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("construction id=%s not found!", constructionId)
			)).build();
		}


		boolean validateConstructionBelongsToConstructor = false;
		for (ConstructionEntity construction : foundContractor.getConstructions()) {
			if (construction.getId() == constructionId) {
				validateConstructionBelongsToConstructor = true;
				return Response.ok(construction).build();
			}
		}


		return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
				String.format("construction id=%s not belongs to contractor id=%s!", constructionId
						, contractorId)
		)).build();

	}

	@POST
	@Path("{id:\\d+}/constructions")
	public Response postConstructionByContractorId(
			@PathParam("id") long contractorId,
			ConstructionEntity constructionEntity
	) {
		//validate contractor id
		constructionEntity.setId(0);
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}
		ContractorEntity contractorEntity = new ContractorEntity();
		contractorEntity.setId(contractorId);

		constructionEntity.setContractor(contractorEntity);
		constructionDao.persist(constructionEntity);

		return Response.status(Response.Status.CREATED).entity(constructionDao.findByID(constructionEntity.getId())).build();
	}


	@PUT
	@Path("{id:\\d+}/constructions/{constructionId:\\d+}")
	public Response updateConstructionByContractorId(
			@PathParam("id") long contractorId,
			@PathParam("constructionId") long constructionId,
			ConstructionEntity constructionEntity
	) {
		constructionEntity.setId(constructionId);


		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}

		//validate construction id
		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		if (foundConstruction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("construction id=%s not found!", constructionId)
			)).build();
		}

		boolean validateConstructionBelongsToConstructor = false;
		for (ConstructionEntity construction : foundContractor.getConstructions()) {
			if (construction.getId() == constructionId) {
				validateConstructionBelongsToConstructor = true;

				ContractorEntity contractorEntity = new ContractorEntity();
				contractorEntity.setId(contractorId);

				constructionEntity.setContractor(contractorEntity);

				constructionDao.merge(constructionEntity);
				return Response.ok(constructionEntity).build();
			}
		}


		return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
				String.format("construction id=%s not belongs to contractor id=%s!", constructionId
						, contractorId)
		)).build();


	}

	@DELETE
	@Path("{id:\\d+}/constructions/{constructionId:\\d+}")
	public Response deleteConstructionByContractorId(
			@PathParam("id") long contractorId,
			@PathParam("constructionId") long constructionId) {
		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(contractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", contractorId)
			)).build();
		}

		//validate construction id
		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		if (foundConstruction == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("construction id=%s not found!", constructionId)
			)).build();
		}

		boolean validateConstructionBelongsToConstructor = false;
		for (ConstructionEntity construction : foundContractor.getConstructions()) {
			if (construction.getId() == constructionId) {
				validateConstructionBelongsToConstructor = true;

				foundConstruction.setDeleted(true);
				constructionDao.merge(foundConstruction);
				return Response.ok().build();
			}
		}


		return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
				String.format("construction id=%s not belongs to contractor id=%s!", constructionId
						, contractorId)
		)).build();
	}

	@GET
	@Path("{id:\\d+}/equipments")
	public Response getEquipmentsBySupplierId(@PathParam("id") long id) {

		//validate contractor id
		ContractorEntity foundContractor = contractorDao.findByID(id);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(
					String.format("contractor id=%s not found!", id)
			)).build();
		}

		return Response.ok(foundContractor.getEquipments()).build();
	}






}
