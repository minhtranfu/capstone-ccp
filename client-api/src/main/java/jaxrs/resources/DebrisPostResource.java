package jaxrs.resources;

import daos.*;
import dtos.requests.DebrisPostPostRequest;
import dtos.requests.DebrisPostRequest;
import entities.ContractorEntity;
import entities.DebrisImageEntity;
import entities.DebrisPostEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.logging.Logger;

@Path("debrisPosts")
@Produces(MediaType.APPLICATION_JSON)
public class DebrisPostResource {
	public static final Logger LOGGER = Logger.getLogger(DebrisPostResource.class.toString());
	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "100";

	@Inject
	DebrisPostDAO debrisPostDAO;

	@Inject
	DebrisServiceTypeDAO debrisServiceTypeDAO;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	DebrisImageSubResource debrisImageSubResource;

	@Inject
	DebrisImageDAO debrisImageDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@Context
	HttpHeaders httpHeaders;

	@GET
	public Response searchdebris(
			@QueryParam("q") @DefaultValue("") String query,
			@QueryParam("lat") Double latitude,
			@QueryParam("long") Double longitude,
			@QueryParam("maxDistance") Double maxDistance,
			@QueryParam("debrisTypeId") List<Long> debrisTypeIdList,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		//  2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		Long contractorId;
		if (httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION) != null) {
			contractorId = getClaimContractorId();
		} else {
			contractorId = null;
		}

		List<DebrisPostEntity> debrisEntities = debrisPostDAO.searchDebrisPostByElasticSearch(
				contractorId,
				query,
				latitude,
				longitude,
				maxDistance,
				debrisTypeIdList,
				orderBy,
				offset,
				limit);

		return Response.ok(debrisEntities).build();
	}


	@GET
	@Path("{id:\\d+}")
	public Response getPostById(@PathParam("id") long postId) {
		return Response.ok(debrisPostDAO.findByIdWithValidation(postId, false)).build();

	}

	private void validatePutPost(DebrisPostEntity debrisPostEntity) {
		debrisPostEntity.getDebrisImages().stream()
				.filter(debrisImageEntity -> debrisImageEntity.getId() == debrisPostEntity.getThumbnailImage().getId())
				.findAny().orElseThrow(() -> new BadRequestException(String.format(
				"thumbnail id=%d not included in image list", debrisPostEntity.getThumbnailImage().getId())));

	}

	@POST
	@RolesAllowed("contractor")
	public Response insertDebrisPost(@Valid DebrisPostPostRequest debrisPostRequest) {
		DebrisPostEntity debrisPostEntity = modelConverter.toEntity(debrisPostRequest);


		long requesterId = getClaimContractorId();
		ContractorEntity requester = new ContractorEntity();
		requester.setId(requesterId);
		debrisPostEntity.setRequester(requester);

		contractorDAO.validateContractorActivated(requesterId);
		validatePutPost(debrisPostEntity);

		debrisPostDAO.persist(debrisPostEntity);

		// TODO: 3/29/19 check bug image thumbnail id not references

		// TODO: 3/23/19 check if image already belongs to another post
		//only add this in post, every edit in future related to image, we use image sub resource
		for (DebrisImageEntity debrisImage : debrisPostEntity.getDebrisImages()) {
			DebrisImageEntity managedImage = debrisImageDAO.findByIdWithValidation(debrisImage.getId());
			managedImage.setDebrisPost(debrisPostEntity);
			debrisImageDAO.merge(managedImage);
		}
		DebrisPostEntity byID = debrisPostDAO.findByID(debrisPostEntity.getId());
		return Response.status(Response.Status.CREATED).entity(byID).build();
	}


	@PUT
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response updatePost(@PathParam("id") long debrisPostId, @Valid DebrisPostRequest putRequest) {

		DebrisPostEntity managedPostEntity = debrisPostDAO.findByIdWithValidation(debrisPostId);

		if (managedPostEntity.getRequester().getId() != getClaimContractorId()) {
			throw new BadRequestException("You cannot edit other people's debris post");
		}

		modelConverter.toEntity(putRequest, managedPostEntity);
		validatePutPost(managedPostEntity);
//		LOGGER.info("updating:" + JsonbBuilder.create().toJson(managedPostEntity));
		return Response.ok(debrisPostDAO.merge(managedPostEntity)).build();
	}


	@PUT
	@Path("{id:\\d+}/status")
	@RolesAllowed("contractor")
	public Response changePostStatus(@PathParam("id") long debrisPostId, DebrisPostEntity request) {
		if (request.getStatus() == null) {
			throw new BadRequestException("Status cannot be null");
		}
		DebrisPostEntity managedPostEntity = debrisPostDAO.findByIdWithValidation(debrisPostId);
		switch (request.getStatus()) {
			case PENDING:
				//  only closed can changed to pending
				if (managedPostEntity.getStatus() != DebrisPostEntity.Status.CLOSED) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							managedPostEntity.getStatus(), request.getStatus()));
				}
				break;
			case ACCEPTED:
				//  3/20/19 already implemented in bid resource
				throw new BadRequestException("Not allowed to change to " + request.getStatus());
			case FINISHED:
				//  3/20/19 already implemented in tranasction resource
				throw new BadRequestException("Not allowed to change to " + request.getStatus());
			case CLOSED:
				//  3/20/19 only pending can change this
				if (managedPostEntity.getStatus() != DebrisPostEntity.Status.PENDING) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							managedPostEntity.getStatus(), request.getStatus()));

				}
				if (getClaimContractorId() != managedPostEntity.getRequester().getId()) {
					throw new BadRequestException("You cannot change post status of other people");
				}

				// TODO: 3/20/19 stop receiving any more bid
				break;
		}


		managedPostEntity.setStatus(request.getStatus());
		return Response.ok(debrisPostDAO.merge(managedPostEntity)).build();
	}


	@GET
	@Path("requester")
	@RolesAllowed("contractor")
	public Response getAllByRequester(
			@QueryParam("status") DebrisPostEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy
	) {
		//noneed to validate this because we trust the token


//		contractorDAO.findByIdWithValidation(getClaimContractorId());
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		return Response.ok(debrisPostDAO.getByRequester(getClaimContractorId(), status, limit, offset, orderBy)).build();
	}

	@GET
	@Path("supplier")
	@RolesAllowed("contractor")
	public Response getAllBySupplier(
			@QueryParam("status") DebrisPostEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy
	) {
		//noneed to validate this because we trust the token


//		contractorDAO.findByIdWithValidation(getClaimContractorId());
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		return Response.ok(debrisPostDAO.getByBidedSupplier(getClaimContractorId(), status, limit, offset, orderBy)).build();
	}

	@Path("{id:\\d+}/images")
	public DebrisImageSubResource toDebrisImageSubResource(@PathParam("id") long postId) {
		debrisImageSubResource.setDebrisPostEntity(debrisPostDAO.findByIdWithValidation(postId));
		return debrisImageSubResource;
	}


	@DELETE
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response deletePost(@PathParam("id") long postId) {
		// TODO: 4/26/19 validate belongs
		DebrisPostEntity debrisPostEntity = debrisPostDAO.findByIdWithValidation(postId);
		if (debrisPostEntity.getRequester().getId() != getClaimContractorId()) {
			throw new BadRequestException("You cannot delete other people's post");
		}


		// TODO: 4/26/19 check status is closed or pending
		if (debrisPostEntity.getStatus() != DebrisPostEntity.Status.PENDING
				&& debrisPostEntity.getStatus() != DebrisPostEntity.Status.CLOSED
				&& debrisPostEntity.getStatus() != DebrisPostEntity.Status.FINISHED) {
			throw new BadRequestException("Cannot delete post with status=" + debrisPostEntity.getStatus());
		}

		debrisPostEntity.setDeleted(true);
		debrisPostDAO.merge(debrisPostEntity);
		return Response.ok().build();
	}
}
