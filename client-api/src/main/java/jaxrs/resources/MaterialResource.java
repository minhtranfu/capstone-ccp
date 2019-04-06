package jaxrs.resources;

import daos.*;
import dtos.requests.MaterialRequest;
import entities.*;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.enterprise.inject.Default;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("materials")
@Produces(MediaType.APPLICATION_JSON)

public class MaterialResource {

	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "100";
	@Inject
	MaterialDAO materialDAO;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	MaterialTypeDAO materialTypeDAO;

	@Inject
	ConstructionDAO constructionDAO;

	@Inject
	MaterialFeedbackDAO materialFeedbackDAO;

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

	@GET
	@Path("{id:\\d+}/feedbacks")
	public Response getFeedbacksByMaterial(@PathParam("id") long id,
										   @QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
										   @QueryParam("offset") @DefaultValue("0") int offset) {
		materialDAO.findByIdWithValidation(id);
		return Response.ok(materialFeedbackDAO.getFeedbacksByMaterial(id, limit, offset)).build();
	}


	@POST
	@RolesAllowed("contractor")
	public Response postMaterial(@NotNull @Valid MaterialRequest materialRequest) {


		MaterialEntity materialEntity = modelConverter.toEntity(materialRequest);

		//get contractor from token
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(claimId.getValue().longValue());
		materialEntity.setContractor(foundContractor);

		// 4/3/19 validate contractor activated
		if (!foundContractor.isActivated()) {
			throw new BadRequestException(String.format("Supplier %s is %s",
					foundContractor.getName(), foundContractor.getStatus().getBeautifiedName()));
		}

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


	@Context
	HttpHeaders httpHeaders;

	@GET
	public Response searchMaterial(
			@QueryParam("q") @DefaultValue("") String query,
			@QueryParam("lat") @DefaultValue(DEFAULT_LAT) double latitude,
			@QueryParam("long") @DefaultValue(DEFAULT_LONG) double longitude,
			@QueryParam("materialTypeId") @DefaultValue("0") long materialTypeId,
			@QueryParam("lquery") @DefaultValue("") String locationQuery,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		// TODO: 2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}


		Long contractorId;
		if (httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION) != null) {
			contractorId = getClaimContractorId();
		} else {
			contractorId = null;
		}
		List<MaterialEntity> materialEntities = materialDAO.searchMaterial(
				contractorId,
				query,
				materialTypeId,
				orderBy,
				offset,
				limit);


//		List<MaterialResponse> result = new ArrayList<MaterialResponse>();
//
//		for (MaterialEntity materialEntity : materialEntities) {
//			MaterialResponse materialResponse = new MaterialResponse(materialEntity
//					, new LocationWrapper(locationQuery, latitude, longitude)
//			);
//			result.add(materialResponse);
//		}
		return Response.ok(materialEntities).build();
	}

	@GET
	@RolesAllowed("contractor")
	@Path("supplier")
	public Response getMaterialsBySupplierId(
			@QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		long supplierId = getClaimContractorId();
		return Response.ok(materialDAO.getBySupplierId(supplierId, limit, offset, orderBy)).build();
	}


}
