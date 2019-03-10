package jaxrs.resources;


import daos.GeneralEquipmentTypeDAO;
import dtos.responses.GeneralEquipmentTypeResponse;
import dtos.responses.MessageResponse;
import entities.GeneralEquipmentTypeEntity;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("generalEquipmentTypes")
@Produces(MediaType.APPLICATION_JSON)
public class GeneralEquipmentTypeResource {

	@Inject
	GeneralEquipmentTypeDAO generalEquipmentTypeDAO;

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
			throw new BadRequestException(String.format("General Equipment Type Id=%d not found", id));

		}

		GeneralEquipmentTypeResponse responseDto = new GeneralEquipmentTypeResponse(foundGeneralEquipmentTypeEntity);
		return Response.ok(responseDto).build();
	}
}
