package jaxrs.services;


import daos.GeneralEquipmentTypeDAO;
import dtos.GeneralEquipmentTypeResponse;
import dtos.MessageResponse;
import entities.GeneralEquipmentTypeEntity;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("generalEquipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class GeneralEquipmentTypeService {
	private static final GeneralEquipmentTypeDAO generalEquipmentTypeDAO = new GeneralEquipmentTypeDAO();

	@GET
	public Response getAllGeneralEquipmentType() {
		List<GeneralEquipmentTypeEntity> allGeneralEquipmentType = generalEquipmentTypeDAO.getAllGeneralEquipmentType();
		List<GeneralEquipmentTypeResponse> responseList = new ArrayList<>();
		for (GeneralEquipmentTypeEntity generalEquipmentTypeEntity : allGeneralEquipmentType) {
			responseList.add(new GeneralEquipmentTypeResponse(generalEquipmentTypeEntity));
		}
		return Response.ok(responseList).build();

	}

	@GET
	@Path("{id:\\d+}")
	public Response getGeneralEquipmentTypeById(@PathParam("id") long id) {
		GeneralEquipmentTypeEntity foundGeneralEquipmentTypeEntity = generalEquipmentTypeDAO.findByID(id);
		if (foundGeneralEquipmentTypeEntity == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Id not found!!")).build();
		}

		GeneralEquipmentTypeResponse responseDto = new GeneralEquipmentTypeResponse(foundGeneralEquipmentTypeEntity);
		return Response.ok(responseDto).build();
	}
}
