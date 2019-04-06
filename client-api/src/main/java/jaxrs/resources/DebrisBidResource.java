package jaxrs.resources;

import daos.ContractorDAO;
import daos.DebrisBidDAO;
import daos.DebrisPostDAO;
import daos.DebrisServiceTypeDAO;
import dtos.requests.DebrisBidRequest;
import dtos.responses.DebrisBidResponse;
import dtos.responses.GETListResponse;
import entities.ContractorEntity;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;
import java.util.function.Consumer;
import java.util.logging.Logger;

@Path("debrisBids")
@Produces(MediaType.APPLICATION_JSON)
public class DebrisBidResource {
	private static final Logger LOGGER = Logger.getLogger(DebrisBidResource.class.toString());


	@Inject
	DebrisServiceTypeDAO debrisServiceTypeDAO;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	DebrisBidDAO debrisBidDAO;

	@Inject
	DebrisPostDAO debrisPostDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getBidById(@PathParam("id") long bidId) {
		DebrisBidEntity entity = debrisBidDAO.findByIdWithValidation(bidId);
		return Response.ok(modelConverter.toResponse(entity)).build();

	}

	@POST
	@RolesAllowed("contractor")
	public Response insertDebrisBid(@Valid DebrisBidRequest debrisBidRequest) {
		LOGGER.info(debrisBidRequest.toString());
		DebrisBidEntity debrisBidEntity = modelConverter.toEntity(debrisBidRequest);


		long supplierId = getClaimContractorId();

		contractorDAO.validateContractorActivated(supplierId);

		//3/21/19 validate cannot post his own post
		DebrisPostEntity managedPost = debrisPostDAO.findByIdWithValidation(debrisBidEntity.getDebrisPost().getId());
		if (managedPost.getRequester().getId() == supplierId) {
			throw new BadRequestException("You cannot bid on your own post");
		}

		//  3/26/19 valdiate only can bid once
		managedPost.getDebrisBids().stream().filter(bid -> bid.getSupplier().getId() == supplierId).findAny().ifPresent(
				bidEntity -> {
					throw new BadRequestException("You already bid this post");
				}
		);

		ContractorEntity supplier = new ContractorEntity();
		supplier.setId(supplierId);
		debrisBidEntity.setSupplier(supplier);

		debrisBidDAO.persist(debrisBidEntity);
		return Response.status(Response.Status.CREATED).entity(
				modelConverter.toResponse(debrisBidDAO.findByID(debrisBidEntity.getId()))).build();
	}


	@PUT
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response updateDebrisBid(@PathParam("id") long debrisBidId, @Valid DebrisBidRequest putRequest) {

		DebrisBidEntity managedDebrisBidEntity = debrisBidDAO.findByIdWithValidation(debrisBidId);

		if (managedDebrisBidEntity.getSupplier().getId() != getClaimContractorId()) {
			throw new BadRequestException("You cannot edit other people's debris post");
		}

		// TODO: 4/5/19 khong cho sua price
		// TODO: 4/5/19 check status la Pending thi moi cho sua
		modelConverter.toEntity(putRequest, managedDebrisBidEntity);
		return Response.ok(modelConverter.toResponse(debrisBidDAO.merge(managedDebrisBidEntity))).build();
	}


	@DELETE
	@Path("{id:\\d+}")
	public Response cancelPendingBid(@PathParam("id") long postId) {
		DebrisBidEntity managedDebrisBid = debrisBidDAO.findByIdWithValidation(postId);
		// check status is pending
		if (managedDebrisBid.getStatus() != DebrisBidEntity.Status.PENDING) {
			throw new BadRequestException("Only PENDING debrisBid can be canceled");
		}
		managedDebrisBid.setDeleted(true);
		debrisBidDAO.merge(managedDebrisBid);
		return Response.ok().build();
	}

	@PUT
	@Path("{id:\\d+}/status")
	@RolesAllowed("contractor")
	public Response acceptBid(@PathParam("id") long debrisBidId, DebrisBidEntity request) {

		if (request.getStatus() == null) {
			throw new BadRequestException("Status cannot be null");
		}
		DebrisBidEntity managedDebrisBidEntity = debrisBidDAO.findByIdWithValidation(debrisBidId);

		switch (request.getStatus()) {
			case PENDING:
				// 3/20/19 not allowed here
				throw new BadRequestException("Not allowed to change to " + request.getStatus());
			case ACCEPTED:
				//  3/20/19 check pending
				//let debrisTransaction handle this
				throw new BadRequestException("Not allowed to change to " + request.getStatus());
//				if (managedDebrisBidEntity.getStatus() != DebrisBidEntity.Status.PENDING) {
//					throw new BadRequestException(String.format("Cannot change from %s to %s",
//							managedDebrisBidEntity.getStatus(), request.getStatus()));
//				}
//
//				// TODO: 3/20/19 only requester can change this
//				if (getClaimContractorId() != managedDebrisBidEntity.getDebrisPost().getRequester().getId()) {
//					throw new BadRequestException("Only requester can change this status");
//				}
//				// TODO: 3/20/19 create new transaction
//				break;
			case FINISHED:
				// 3/20/19 not allowed here
				throw new BadRequestException("Not allowed to change to " + request.getStatus());
		}

		managedDebrisBidEntity.setStatus(request.getStatus());
		return Response.ok(modelConverter.toResponse(debrisBidDAO.merge(managedDebrisBidEntity))).build();
	}


	@GET
	@Path("supplier")
	@RolesAllowed("contractor")
	public Response getAllBySupplier(
			@QueryParam("status") DebrisBidEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		GETListResponse<DebrisBidEntity> bySupplier = debrisBidDAO.getBySupplier(
				getClaimContractorId(), status, limit, offset, orderBy);

		List<DebrisBidResponse> debrisBidResponses = modelConverter.toResponse(bySupplier.getItems());

		GETListResponse<DebrisBidResponse> response = new GETListResponse<>(
				bySupplier.getTotalItems()
				, bySupplier.getLimit()
				, bySupplier.getOffset()
				, bySupplier.getOrderBy()
				, debrisBidResponses
		);

		return Response.ok(response).build();
	}


}
