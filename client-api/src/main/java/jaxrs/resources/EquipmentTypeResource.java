package jaxrs.resources;

import daos.EquipmentTypeDAO;
import dtos.responses.MessageResponse;
import entities.EquipmentTypeEntity;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/equipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentTypeResource {
	public static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();

	@GET
	public Response getAllEquipmentTypes() {

		return Response.ok(equipmentTypeDAO.getAllEquipmentTypes()).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipmentTypeById(@PathParam("id") long id) {
		EquipmentTypeEntity foundEquipmentTypeEntity = equipmentTypeDAO.findByID(id);
		if (foundEquipmentTypeEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Id not found!!")).build();
		}

		return Response.ok(foundEquipmentTypeEntity).build();
	}

}
