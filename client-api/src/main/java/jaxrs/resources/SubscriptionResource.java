package jaxrs.resources;

import daos.ContractorDAO;
import daos.FeedbackDAO;
import daos.SubscriptionDAO;
import dtos.requests.SubscriptionRequest;
import entities.ContractorEntity;
import entities.SubscriptionEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Remove;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("subscriptions")
@Produces(MediaType.APPLICATION_JSON)
public class SubscriptionResource {


	@Inject
	SubscriptionDAO subscriptionDAO;

	@Inject
	FeedbackDAO feedbackDAO;

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
		return Response.ok(subscriptionDAO.findByID(id)).build();
//		return Response.ok(entityManager.find(FeedbackEntity.class,id)).build();
	}

	@GET
	@RolesAllowed("contractor")
	public Response getAllSubscriptionFromContractor() {
		ContractorEntity managedContractor = contractorDAO.findByIdWithValidation(getClaimContractorId());
//		List<SubscriptionEntity> resultList = entityManager.createQuery("select e from SubscriptionEntity  e", SubscriptionEntity.class)
//				.getResultList();
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
		subscriptionDAO.delete(managedSubscription);
		return Response.ok().build();
	}


}
