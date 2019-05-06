package jaxrs.resources;

import daos.ContractorDAO;
import daos.ReportDAO;
import daos.SubscriptionDAO;
import dtos.requests.SubscriptionRequest;
import entities.ContractorEntity;
import entities.SubscriptionEntity;
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

@Path("subscriptions")
@Produces(MediaType.APPLICATION_JSON)
public class SubscriptionResource {


	@Inject
	SubscriptionDAO subscriptionDAO;

	@Inject
	ReportDAO reportDAO;

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
	public Response getSubscriptionById(@PathParam("id") long id) {
		return Response.ok(subscriptionDAO.findByIdWithValidation(id,false)).build();
//		return Response.ok(entityManager.find(FeedbackEntity.class,id)).build();
	}

	@GET
	@RolesAllowed("contractor")
	public Response getAllSubscriptionFromContractor(
			@QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {
		ContractorEntity managedContractor = contractorDAO.findByIdWithValidation(getClaimContractorId());
		subscriptionDAO.getSubscriptionsByContractorId(getClaimContractorId(), limit, offset);
		return Response.ok(managedContractor.getSubscriptionEntities()).build();
	}

	@POST
	@RolesAllowed("contractor")
	public Response subscribe(@Valid SubscriptionRequest subscriptionRequest) {
		ContractorEntity managedContractor = contractorDAO.findByIdWithValidation(getClaimContractorId());
		SubscriptionEntity subscriptionEntity = modelConverter.toEntity(subscriptionRequest);
		subscriptionEntity.setContractor(managedContractor);

		subscriptionDAO.persist(subscriptionEntity);
		return Response.status(Response.Status.CREATED).entity(subscriptionDAO.findByID(subscriptionEntity.getId())).build();
	}

	@PUT
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response editSubscription(@PathParam("id") long subscriptionId, @Valid SubscriptionRequest request) {
		SubscriptionEntity managedSubscription = subscriptionDAO.findByIdWithValidation(subscriptionId);
		//no need to validate contractor form token
		if (getClaimContractorId() != managedSubscription.getContractor().getId()) {
			throw new BadRequestException("You cannot edit other people's subsription");
		}
		modelConverter.toEntity(request, managedSubscription);
		// TODO: 3/14/19 convert
		return Response.ok(subscriptionDAO.merge(managedSubscription)).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	@RolesAllowed("contractor")
	public Response unsubscribe(@PathParam("id") long subscriptionId) {
		SubscriptionEntity managedSubscription = subscriptionDAO.findByIdWithValidation(subscriptionId);
		if (getClaimContractorId() != managedSubscription.getContractor().getId()) {
			throw new BadRequestException("You cannot edit other people's subsription");
		}
		managedSubscription.setDeleted(true);
		subscriptionDAO.merge(managedSubscription);
		return Response.ok().build();
	}


}
