package jaxrs.resources;

import daos.EquipmentImageDAO;
import entities.EquipmentImageEntity;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import utils.Constants;
import utils.ImageUtil;

import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Path("equipmentImages")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentImageResource {

	@Context
	ServletContext servletContext;

	@Inject
	EquipmentImageDAO equipmentImageDAO;
	@GET
	public Response status() {
		return Response.ok("status is good!").build();
	}

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadTempImages(List<Attachment> attachmentList) throws IOException {
		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		List<String> urlList = ImageUtil.uploadImages(credentialPath, attachmentList);
		List<EquipmentImageEntity> resultList = new ArrayList<>();

		for (String url : urlList) {
			EquipmentImageEntity equipmentImageEntity = new EquipmentImageEntity();
			equipmentImageEntity.setUrl(url);
			equipmentImageDAO.persist(equipmentImageEntity);
			resultList.add(equipmentImageEntity);
		}
		return Response.status(Response.Status.CREATED).entity(resultList).build();
	}

}
