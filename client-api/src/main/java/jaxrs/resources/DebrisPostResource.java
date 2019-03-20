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
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonBuilderFactory;
import javax.json.JsonNumber;
import javax.json.bind.JsonbBuilder;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.logging.Logger;

@Path("debrisPost")
public class DebrisPostResource {
	public static final Logger LOGGER = Logger.getLogger(DebrisPostResource.class.toString());

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
