package jaxrs.services;


import daos.GeneralEquipmentTypeDAO;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
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
}
