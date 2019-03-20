package jaxrs.resources;

import daos.GeneralMaterialTypeDAO;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("generalMaterialTypes")
@Produces(MediaType.APPLICATION_JSON)

public class GeneralMaterialTypeResource {

	@Inject
	GeneralMaterialTypeDAO generalMaterialTypeDAO;

	@GET
	public Response getAllGeneralmaterialType() {
		return Response.ok(generalMaterialTypeDAO.findAll()).build();

	}

	@GET
	@Path("{id:\\d+}")
	public Response getGeneralmaterialTypeById(@PathParam("id") long id) {
		return Response.ok(generalMaterialTypeDAO.findByIdWithValidation(id)).build();
	}
}
