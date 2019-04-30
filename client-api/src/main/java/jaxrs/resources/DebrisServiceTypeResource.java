package jaxrs.resources;

import daos.DebrisServiceTypeDAO;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("debrisServiceTypes")
@Produces(MediaType.APPLICATION_JSON)
public class DebrisServiceTypeResource {
	@Inject
	DebrisServiceTypeDAO debrisServiceTypeDAO;

	@GET
	public Response getAll() {
		return Response.ok(debrisServiceTypeDAO.findAll(false)).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getById(@PathParam("id") long debrisServiceTypeId) {
		return Response.ok(debrisServiceTypeDAO.findByIdWithValidation(debrisServiceTypeId)).build();
	}


}
