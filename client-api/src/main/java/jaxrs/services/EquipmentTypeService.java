package jaxrs.services;

import daos.EquipmentTypeDAO;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("/equipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentTypeService {
	public static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();

	@GET
	public Response getAllEquipmentTypes() {

		return Response.ok(equipmentTypeDAO.getAllEquipmentTypes()).build();
	}
}
