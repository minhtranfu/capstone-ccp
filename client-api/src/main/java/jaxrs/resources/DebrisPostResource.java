package jaxrs.resources;

import daos.ConstructionDAO;
import daos.ContractorDAO;
import daos.DebrisPostDAO;
import daos.DebrisServiceTypeDAO;
import dtos.IdOnly;
import dtos.requests.DebrisPostRequest;
import entities.ContractorEntity;
import entities.DebrisPostEntity;
import entities.DebrisServiceTypeEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.omg.CORBA.PUBLIC_MEMBER;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonBuilderFactory;
import javax.json.JsonNumber;
import javax.json.bind.JsonbBuilder;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.Optional;
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
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}


	@GET
	public Response searchdebris(
			@QueryParam("q")  @DefaultValue("") String query,
			@QueryParam("lat") Double latitude,
			@QueryParam("long") Double longitude,
			@QueryParam("S") Double maxDistance,
			@QueryParam("debrisTypeId") List<Long> debrisTypeIdList,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		//  2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}


		List<DebrisPostEntity> debrisEntities = debrisPostDAO.searchDebrisPost(
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

		return Response.ok(debrisPostDAO.findByIdWithValidation(postId)).build();

	}

	@POST
	@RolesAllowed("contractor")
	public Response insertDebrisPost(@Valid DebrisPostRequest debrisPostRequest) {
		DebrisPostEntity debrisPostEntity = modelConverter.toEntity(debrisPostRequest);

//		debrisPostEntity.getDebrisServiceTypes().clear();
//		for (IdOnly debrisServiceType : debrisPostRequest.getDebrisServiceTypes()) {
//			DebrisServiceTypeEntity byIdWithValidation = debrisServiceTypeDAO.findByIdWithValidation(debrisServiceType.getId());
//			debrisPostEntity.getDebrisServiceTypes().add(byIdWithValidation);
//		}

		long requesterId = getClaimContractorId();
		ContractorEntity requester = new ContractorEntity();
		requester.setId(requesterId);
		debrisPostEntity.setRequester(requester);
		return Response.status(Response.Status.CREATED).entity(debrisPostDAO.merge(debrisPostEntity)).build();
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

	@DELETE
	@Path("{id:\\d+}")
	public Response delete(@PathParam("id") long postId) {
		DebrisPostEntity managedDebrisPost = debrisPostDAO.findByIdWithValidation(postId);
		managedDebrisPost.setDeleted(true);
		debrisPostDAO.merge(managedDebrisPost);
		return Response.ok().build();
	}

	@GET
	@Path("requester")
	@RolesAllowed("contractor")
	public Response getAllByRequester() {
		contractorDAO.findByIdWithValidation(getClaimContractorId());
		return Response.ok(debrisPostDAO.getByRequester(getClaimContractorId())).build();
	}

}
