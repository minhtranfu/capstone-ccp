package jaxrs.resources;

import daos.FeedbackTypeDAO;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("feedbackTypes")
public class FeedbackTypeResource {
	@Inject
	FeedbackTypeDAO feedbackTypeDAO;
	@GET
	public Response getAll() {
		return Response.ok(feedbackTypeDAO.findAll()).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getById(@PathParam("id") long id) {
		return Response.ok(feedbackTypeDAO.findByIdWithValidation(id)).build();
	}



}
