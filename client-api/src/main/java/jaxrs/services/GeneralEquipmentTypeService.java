package jaxrs.services;


import daos.GeneralEquipmentTypeDAO;
import dtos.MessageResponse;
import entities.GeneralEquipmentTypeEntity;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("generalEquipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class GeneralEquipmentTypeService {
	private static final GeneralEquipmentTypeDAO generalEquipmentTypeDAO = new GeneralEquipmentTypeDAO();

	@GET
	public Response getAllGeneralEquipmentType() {
		return Response.ok(generalEquipmentTypeDAO.getAllGeneralEquipmentType()).build();

	}

	@GET
	@Path("{id:\\d+}")
	public Response getGeneralEquipmentTypeById(@PathParam("id") long id) {
		GeneralEquipmentTypeEntity foundGeneralEquipmentTypeEntity = generalEquipmentTypeDAO.findByID(id);
		if (foundGeneralEquipmentTypeEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Id not found!!")).build();
		}

		return Response.ok(foundGeneralEquipmentTypeEntity).build();
	}
}
