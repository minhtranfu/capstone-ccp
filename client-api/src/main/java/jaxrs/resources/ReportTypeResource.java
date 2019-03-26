package jaxrs.resources;

import daos.ReportTypeDAO;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("reportTypes")
public class ReportTypeResource {
	@Inject
	ReportTypeDAO reportTypeDAO;
	@GET
	public Response getAll() {
		return Response.ok(reportTypeDAO.findAll()).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getById(@PathParam("id") long id) {
		return Response.ok(reportTypeDAO.findByIdWithValidation(id)).build();
	}



}
