package jaxrs.resources;

import daos.ContractorDAO;
import daos.DebrisBidDAO;
import daos.DebrisPostDAO;
import daos.DebrisTransactionDAO;
import dtos.requests.DebrisTransactionRequest;
import entities.*;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("debrisTransactions")
public class DebrisTransactionResource {
	@Inject
	DebrisTransactionDAO debrisTransactionDAO;


	@Inject
	ContractorDAO contractorDAO;

	@Inject
	DebrisPostDAO debrisPostDAO;
	@Inject
	DebrisBidDAO debrisBidDAO;


	@Inject
	ModelConverter modelConverter;


	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@POST
	@RolesAllowed("contractor")
	public Response requestTransaction(@Valid DebrisTransactionRequest debrisTransactionRequest) {


		//3/10/19 get requester id from token
		long requesterId = getClaimContractorId();


		DebrisTransactionEntity debrisTransactionEntity = modelConverter.toEntity(debrisTransactionRequest);


		DebrisPostEntity managedPost = debrisPostDAO.findByIdWithValidation(debrisTransactionEntity.getDebrisPost().getId());
		debrisTransactionEntity.setDebrisPost(managedPost);

		DebrisBidEntity managedBid = debrisBidDAO.findByIdWithValidation(debrisTransactionEntity.getDebrisBid().getId());
		debrisTransactionEntity.setDebrisBid(managedBid);


		if (requesterId != managedPost.getRequester().getId()) {
			throw new BadRequestException("Only Post Requester can make debris transaction!");
		}

		// 4/3/19 validate reqquester must be activated
		contractorDAO.validateContractorActivated(requesterId);


		// 3/21/19 validate status of post and bid
		if (managedBid.getStatus() != DebrisBidEntity.Status.PENDING) {
			throw new BadRequestException("DebrisBid must be PENDING to be ACCEPTED!");
		}
		if (managedPost.getStatus() != DebrisPostEntity.Status.PENDING) {
			throw new BadRequestException("DebrisPost must be PENDING to be ACCEPTED!");
		}

		managedBid.setStatus(DebrisBidEntity.Status.ACCEPTED);
		managedPost.setStatus(DebrisPostEntity.Status.ACCEPTED);

		//  3/21/19  set status to ACCEPTED
		debrisTransactionEntity.setStatus(DebrisTransactionEntity.Status.ACCEPTED);

//		debrisTransactionDAO.merge(debrisTransactionEntity);
		return Response.status(Response.Status.CREATED).entity(
				debrisTransactionDAO.findByID(debrisTransactionDAO.merge(debrisTransactionEntity).getId())
		).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getTransaction(@PathParam("id") long id) {

		DebrisTransactionEntity foundTransaction = debrisTransactionDAO.findByIdWithValidation(id);
		return Response.ok(foundTransaction).build();
	}

	@PUT
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response updateTransactionStatus(@PathParam("id") long id, DebrisTransactionEntity statusRequest) {

		// TODO: 3/10/19 validate authority

		// TODO: 2/9/19 if approved, auto deny all intersected requests

		DebrisTransactionEntity foundTransaction = debrisTransactionDAO.findByIdWithValidation(id);


		if (statusRequest.getStatus() == null) {
			throw new BadRequestException("Status is null!");
		}


		switch (statusRequest.getStatus()) {
			case ACCEPTED:
				//validate

				if (foundTransaction.getStatus() != DebrisTransactionEntity.Status.ACCEPTED) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), statusRequest.getStatus()));

				}
				contractorDAO.validateContractorActivated(foundTransaction.getRequester());
				contractorDAO.validateContractorActivated(foundTransaction.getSupplier());
				break;
			case DELIVERING:


				if (foundTransaction.getStatus() != DebrisTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != statusRequest.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), statusRequest.getStatus()));
				}
				// TODO: 3/21/19 validate only supplier
				if (foundTransaction.getSupplier().getId() != getClaimContractorId()) {
					throw new BadRequestException("Only supplier can change this status");
				}
				break;
			case WORKING:
				//validate


				if (foundTransaction.getStatus() != DebrisTransactionEntity.Status.DELIVERING
						&& foundTransaction.getStatus() != statusRequest.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), statusRequest.getStatus()));
				}

				// TODO: 3/21/19 validate only supplier
				if (foundTransaction.getSupplier().getId() != getClaimContractorId()) {
					throw new BadRequestException("Only supplier can change this status");
				}

				break;

			case FINISHED:
				//validate
				// 3/21/19 validate only requester
				if (foundTransaction.getRequester().getId() != getClaimContractorId()) {
					throw new BadRequestException("Only requester can change this status");
				}
				if (foundTransaction.getStatus() != DebrisTransactionEntity.Status.WORKING
						&& foundTransaction.getStatus() != statusRequest.getStatus()) {

					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), statusRequest.getStatus()));
				}

				// 3/21/19 change both staus to finished
				foundTransaction.getDebrisBid().setStatus(DebrisBidEntity.Status.FINISHED);
				foundTransaction.getDebrisPost().setStatus(DebrisPostEntity.Status.FINISHED);
				debrisBidDAO.merge(foundTransaction.getDebrisBid());
				debrisPostDAO.merge(foundTransaction.getDebrisPost());

				break;
			case CANCELED:

				String cancelReason = statusRequest.getCancelReason();
				foundTransaction.setCancelReason(cancelReason);
				
				//canceledBy
				ContractorEntity canceledBy = new ContractorEntity();
				canceledBy.setId(getClaimContractorId());
				foundTransaction.setCanceledBy(canceledBy);

				if (cancelReason == null || cancelReason.isEmpty()) {
					throw new BadRequestException("You must have cancel reason");
				}

				// 3/21/19 only requester or supplier can do this
				if (foundTransaction.getRequester().getId() != getClaimContractorId()
						&& foundTransaction.getSupplier().getId() != getClaimContractorId()) {
					throw new BadRequestException("Only requester or supplier can change this status");
				}

				// cannot change from FINISHED to CANCELED
				if (foundTransaction.getStatus() == DebrisTransactionEntity.Status.FINISHED) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), statusRequest.getStatus()));
				}


				// 3/21/19 roll back to PENDING both bid and post
				foundTransaction.getDebrisBid().setStatus(DebrisBidEntity.Status.PENDING);
				foundTransaction.getDebrisPost().setStatus(DebrisPostEntity.Status.PENDING);
				debrisBidDAO.merge(foundTransaction.getDebrisBid());
				debrisPostDAO.merge(foundTransaction.getDebrisPost());
				break;
		}

		foundTransaction.setStatus(statusRequest.getStatus());
		return Response.status(Response.Status.OK).entity(debrisTransactionDAO.merge(foundTransaction)).build();
	}

	@GET
	@Path("supplier")
	@RolesAllowed("contractor")
	public Response getDebrisTransactionsBySupplierId(
			@QueryParam("status") DebrisTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		long supplierId = getClaimContractorId();
		return Response.ok(debrisTransactionDAO.getDebrisTransactionsBySupplierId
				(supplierId, status, limit, offset, orderBy)).build();

	}


	@GET
	@Path("requester")
	@RolesAllowed("contractor")
	public Response getDebrisTransactionsAsRequester(
			@QueryParam("status") DebrisTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {

		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}
		long requesterId = getClaimContractorId();
//		//validate claim contractor
//		if (requesterId != claimContractorId.getValue().longValue()) {
//			throw new BadRequestException("You cannot view other people's transaction");
//		}
		return Response.ok(debrisTransactionDAO.
				getDebrisTransactionsByRequesterId(requesterId, status, limit, offset, orderBy)).build();
	}


}
