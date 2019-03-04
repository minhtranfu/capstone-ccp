package jaxrs.resources;

import daos.FeedbackDAO;
import daos.SubscriptionDAO;
import entities.SubscriptionEntity;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
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

	@PersistenceContext
	EntityManager entityManager;

	@GET
	@Path("{id:\\d+}")
	public Response getSubscriptionById(@PathParam("id") long id) {

		return Response.ok(subscriptionDAO.findByID(id)).build();
//		return Response.ok(entityManager.find(FeedbackEntity.class,id)).build();
	}

	@GET
	public Response getAllSubscription() {

		List<SubscriptionEntity> resultList = entityManager.createQuery("select e from SubscriptionEntity  e", SubscriptionEntity.class)
				.getResultList();
		return Response.ok(resultList).build();
	}



}
