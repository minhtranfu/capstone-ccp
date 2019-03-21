package jaxrs.resources;

import daos.DebrisFeedbackDAO;
import daos.DebrisTransactionDAO;
import dtos.requests.DebrisFeedbackRequest;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisFeedbackEntity;
import entities.DebrisTransactionEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("debrisFeedbacks")
public class DebrisFeedbackResource {


	@Inject
	DebrisTransactionDAO debrisTransactionDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	DebrisFeedbackDAO debrisFeedbackDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@POST
	@RolesAllowed("contractor")
	public Response requestFeedback(@Valid DebrisFeedbackRequest debrisFeedbackRequest) {


		DebrisFeedbackEntity debrisFeedbackEntity = modelConverter.toEntity(debrisFeedbackRequest);

		// TODO: 3/21/19 validate transction status must be FINISHED or CANCELED

		DebrisTransactionEntity managedTransaction = debrisTransactionDAO.findByIdWithValidation(debrisFeedbackEntity.getDebrisTransaction().getId());
		if (managedTransaction.getStatus() != DebrisTransactionEntity.Status.FINISHED
				&& managedTransaction.getStatus() != DebrisTransactionEntity.Status.CANCELED) {
			throw new BadRequestException("You can only feedback on FINISHED or CANCELED status");
		}

		if (managedTransaction.getRequester().getId() != getClaimContractorId()) {
			throw new BadRequestException("Only requester can make feedback");
		}

		debrisFeedbackDAO.persist(debrisFeedbackEntity);
		return Response.status(Response.Status.CREATED).entity(
				debrisFeedbackDAO.findByID(debrisFeedbackEntity.getId())
		).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getFeedback(@PathParam("id") long id) {

		DebrisFeedbackEntity foundFeedback = debrisFeedbackDAO.findByIdWithValidation(id);
		return Response.ok(foundFeedback).build();
	}


}
