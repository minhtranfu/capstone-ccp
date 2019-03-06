package jaxrs.resources;

import daos.ConstructionDAO;
import entities.ConstructionEntity;
import entities.ContractorEntity;
import entities.EquipmentEntity;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Stateless
public class ConstructionResource {
	private ContractorEntity contractorEntity;

	@Inject
	ConstructionDAO constructionDao;

	public ConstructionResource() {
	}


	public ContractorEntity getContractorEntity() {
		return contractorEntity;
	}

	public void setContractorEntity(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}

	public ConstructionResource(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}


	@GET
	public Response getConstructionsByContractorId() {

		return Response.ok(contractorEntity.getConstructions()).build();
	}

	public void validateContructionAll(long constructionId) {
		//validate construction id
		ConstructionEntity foundConstruction = constructionDao.findByIdWithValidation(constructionId);

		if (foundConstruction.getContractor().getId() != contractorEntity.getId()) {
			throw new BadRequestException(String.format("construction id=%s not belongs to contractor id=%s!"
					, constructionId, contractorEntity.getId()
			));
		}



	}

	@GET
	@Path("{constructionId:\\d+}")
	public Response getConstructionByConstructionId(
			@PathParam("constructionId") long constructionId
	) {

		validateContructionAll(constructionId);
		return Response.ok(constructionDao.findByID(constructionId)).build();
	}

	@POST
	public Response postConstructionByContractorId(
			@Valid ConstructionEntity constructionEntity
	) {
		constructionEntity.setContractor(contractorEntity);
		constructionDao.persist(constructionEntity);

		return Response.status(Response.Status.CREATED).entity(constructionDao.findByID(constructionEntity.getId())).build();
	}


	@PUT
	@Path("{constructionId:\\d+}")
	public Response updateConstructionByContractorId(
			@PathParam("constructionId") long constructionId,
			@Valid ConstructionEntity constructionEntity
	) {

		validateContructionAll(constructionId);


		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);
		//todo use mapper here ?

		//get what needed
		foundConstruction.setContractor(contractorEntity);
		foundConstruction.setAddress(constructionEntity.getAddress());
		foundConstruction.setName(constructionEntity.getName());
		foundConstruction.setLatitude(constructionEntity.getLatitude());
		foundConstruction.setLongitude(constructionEntity.getLongitude());




		return Response.ok(constructionDao.merge(foundConstruction)).build();
	}

	@DELETE
	@Path("{constructionId:\\d+}")
	public Response deleteConstructionByContractorId(
			@PathParam("constructionId") long constructionId) {

		validateContructionAll(constructionId);
		ConstructionEntity foundConstruction = constructionDao.findByID(constructionId);

		// TODO: 3/6/19 update address for equipment 
		for (EquipmentEntity equipmentEntity : foundConstruction.getEquipmentEntities()) {
			equipmentEntity.setAddress(foundConstruction.getAddress());
			equipmentEntity.setLatitude(foundConstruction.getLatitude());
			equipmentEntity.setLongitude(foundConstruction.getLongitude());
			equipmentEntity.setConstruction(null);
		}

		foundConstruction.setDeleted(true);
		constructionDao.merge(foundConstruction);
		return Response.ok().build();

	}

}
