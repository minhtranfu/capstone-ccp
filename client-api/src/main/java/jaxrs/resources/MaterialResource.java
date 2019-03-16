package jaxrs.resources;

import daos.ConstructionDAO;
import daos.ContractorDAO;
import daos.MaterialDAO;
import daos.MaterialTypeDAO;
import dtos.requests.MaterialRequest;
import entities.*;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("materials")
public class MaterialResource {


	@Inject
	MaterialDAO materialDAO;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	MaterialTypeDAO materialTypeDAO;

	@Inject
	ConstructionDAO constructionDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimId;

	@Inject
	ModelConverter modelConverter;

	private long getClaimContractorId() {
		return claimId.getValue().longValue();
	}


	@GET
	@Path("{id:\\d+}")
	public Response getMaterial(@PathParam("id") long id) {
		return Response.ok(materialDAO.findByIdWithValidation(id)).build();
	}


	@POST
//	@RolesAllowed({"USER"})
	@RolesAllowed("contractor")
	public Response postMaterial(@NotNull @Valid MaterialRequest materialRequest) {


		MaterialEntity materialEntity = modelConverter.toEntity(materialRequest);

		//get contractor from token
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(claimId.getValue().longValue());
		materialEntity.setContractor(foundContractor);


		validatePostPutMaterial(materialEntity);
		materialDAO.persist(materialEntity);

		return Response.status(Response.Status.CREATED).entity(
				materialDAO.findByID(materialEntity.getId())
		).build();

	}

	private void validatePostPutMaterial(MaterialEntity materialEntity) {
		//check for constructor id
		long contractorId = materialEntity.getContractor().getId();
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(contractorId);

		//set found entity to use addtional property more than just ID !
		materialEntity.setContractor(foundContractor);

		//validate contractor activated
		contractorDAO.validateContractorActivated(foundContractor);

		long materialTypeId = materialEntity.getMaterialType().getId();

		//validate material tye
		MaterialTypeEntity foundMaterialType = materialTypeDAO.findByIdWithValidation(materialTypeId);
		materialEntity.setMaterialType(foundMaterialType);

		//check construction

		long constructionId = materialEntity.getConstruction().getId();
		ConstructionEntity foundConstructionEntity = constructionDAO.findByIdWithValidation(constructionId);
		if (foundConstructionEntity.getContractor().getId() != materialEntity.getContractor().getId()) {
			throw new BadRequestException(String.format("construction id=%d not belongs to contractor id=%d"
					, constructionId
					, foundContractor.getId()));
		}
		materialEntity.setConstruction(foundConstructionEntity);
	}

	@PUT
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response updateMaterialById(@PathParam("id") long id, @NotNull @Valid MaterialRequest materialPutRequest) {


		// TODO: 3/16/19 validate contractor


		MaterialEntity foundMaterial = materialDAO.findByIdWithValidation(id);
		modelConverter.toEntity(materialPutRequest, foundMaterial);

		if (foundMaterial.getContractor().getId() != getClaimContractorId()) {
			throw new BadRequestException("You cannot edit other people's material");
		}


		validatePostPutMaterial(foundMaterial);
		return Response.status(Response.Status.OK).entity(
				materialDAO.merge(foundMaterial)).build();
	}

	

}
