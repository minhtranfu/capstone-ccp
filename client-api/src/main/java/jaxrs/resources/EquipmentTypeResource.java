package jaxrs.resources;

import daos.EquipmentTypeDAO;
import entities.EquipmentTypeEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/equipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentTypeResource {
	@Inject
	public EquipmentTypeDAO equipmentTypeDAO ;

	@GET
	public Response getAllEquipmentTypes() {

		return Response.ok(equipmentTypeDAO.findAll(false)).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipmentTypeById(@PathParam("id") long id) {
		EquipmentTypeEntity foundEquipmentTypeEntity = equipmentTypeDAO.findByID(id);
		if (foundEquipmentTypeEntity == null) {
			throw new BadRequestException(String.format("Equipment Type Id=%d not found", id));
		}

		return Response.ok(foundEquipmentTypeEntity).build();
	}

}
