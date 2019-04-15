package jaxrs.resources;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import daos.EquipmentDAO;
import daos.EquipmentImageDAO;
import dtos.IdOnly;
import entities.EquipmentImageEntity;
import entities.EquipmentEntity;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import utils.Constants;
import utils.ImageUtil;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.function.Predicate;
import java.util.function.Supplier;

import static utils.Constants.BUCKET_NAME;

@Produces(MediaType.APPLICATION_JSON)

public class EquipmentImageSubResource {
	@Context
	ServletContext servletContext;
	@Inject
	EquipmentImageDAO equipmentImageDAO;

	@Inject
	EquipmentDAO equipmentDAO;


	private EquipmentEntity equipmentEntity;

	public EquipmentImageSubResource() {
	}

	public EquipmentEntity getEquipmentEntity() {
		return equipmentEntity;
	}

	public void setEquipmentEntity(EquipmentEntity equipmentEntity) {
		this.equipmentEntity = equipmentEntity;
	}


	private EquipmentImageEntity validateImage(long imageId) {
		EquipmentImageEntity foundImage = equipmentImageDAO.findByIdWithValidation(imageId);
		if (foundImage.getEquipment() != null &&
				foundImage.getEquipment().getId() != equipmentEntity.getId()) {
			throw new BadRequestException(String.format("Equipment id=%d not contain EquipmentImage id=%d",
					equipmentEntity.getId(), imageId));
		}

		return foundImage;
	}

	@GET
	@Path("{id:\\d+}")
	public Response getImageById(@PathParam("id") long imageId) {
		return Response.ok(validateImage(imageId)).build();
	}

	@GET
	public Response getImages() {
		return Response.ok(equipmentEntity.getEquipmentImages()).build();
	}

	@POST
	public Response addUploadedImageWithId(@NotNull List<@Valid IdOnly> equipmentImageRequests) {


		for (IdOnly equipmentImageRequest : equipmentImageRequests) {
			EquipmentImageEntity equipmentImageEntity = equipmentImageDAO.findByIdWithValidation(equipmentImageRequest.getId());

			// validate equipment image
			if (equipmentImageEntity.getEquipment() != null
					&& equipmentImageEntity.getEquipment().getId() != equipmentEntity.getId()) {
				throw new BadRequestException(String.format("EquipmentImage id=%d is already belongs to Equipment id=%d",
						equipmentImageEntity.getId(),
						equipmentImageEntity.getEquipment().getId()));
			}
			equipmentImageEntity.setEquipment(equipmentEntity);
			equipmentImageDAO.merge(equipmentImageEntity);
//			equipmentEntity.addEquipmentImage(equipmentImageEntity);
		}

		return Response.status(Response.Status.CREATED).entity(equipmentDAO.findByID(equipmentEntity.getId())).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	public Response deleteImage(@PathParam("id") long imageId) {

		EquipmentImageEntity foundImage = validateImage(imageId);

		// TODO: 3/4/19 delete from bucket server
		if (equipmentEntity.getEquipmentImages().size() <= 1) {
			throw new BadRequestException("There must be at least 1 image");
		}

		//check if delete thumbnail image
		if (equipmentEntity.getThumbnailImage() != null && equipmentEntity.getThumbnailImage().getId() == imageId) {
			//set thumbnail to another image
			equipmentEntity.setThumbnailImage(equipmentEntity.getEquipmentImages().stream().filter(
					equipmentImageEntity -> equipmentImageEntity.getId() != imageId
			).findAny().orElseThrow(() -> new BadRequestException("You are deleting thumbnail with no other replacement")));
			equipmentEntity = equipmentDAO.merge(equipmentEntity);
		}

		equipmentImageDAO.delete(foundImage);
		return Response.ok().build();
	}


}
