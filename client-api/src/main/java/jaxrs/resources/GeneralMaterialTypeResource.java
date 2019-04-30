package jaxrs.resources;

import daos.GeneralMaterialTypeDAO;
import entities.GeneralMaterialTypeEntity;
import utils.ModelConverter;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("generalMaterialTypes")
@Produces(MediaType.APPLICATION_JSON)

public class GeneralMaterialTypeResource {

	@Inject
	GeneralMaterialTypeDAO generalMaterialTypeDAO;

	@Inject
	ModelConverter modelConverter;

	@GET
	public Response getAllGeneralMaterialType() {
		List<GeneralMaterialTypeEntity> all = generalMaterialTypeDAO.findAll(false);

		return Response.ok(all.stream().
				map(generalMaterialTypeEntity -> modelConverter.toResponse(generalMaterialTypeEntity))
				.toArray()).build();

	}

	@GET
	@Path("{id:\\d+}")
	public Response getGeneralMaterialTypeById(@PathParam("id") long id) {

		GeneralMaterialTypeEntity generalMaterialTypeEntity = generalMaterialTypeDAO.findByIdWithValidation(id);
		return Response.ok(modelConverter.toResponse(generalMaterialTypeEntity)).build();
	}
}
