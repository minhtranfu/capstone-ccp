package jaxrs.resources;


import daos.DebrisImageDAO;
import daos.DebrisPostDAO;
import dtos.IdOnly;
import entities.DebrisImageEntity;
import entities.DebrisPostEntity;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

@Stateless
public class DebrisImageSubResource {
	@Context
	ServletContext servletContext;
	@Inject
	DebrisImageDAO debrisImageDAO;

	@Inject
	DebrisPostDAO debrisPostDAO;



	private DebrisPostEntity debrisPostEntity;

	public DebrisImageSubResource() {
	}

	public DebrisPostEntity getDebirsPostEntity() {
		return debrisPostEntity;
	}

	public void setDebrisPostEntity(DebrisPostEntity debrisEntity) {
		this.debrisPostEntity = debrisEntity;
	}


	private DebrisImageEntity validateImage(long imageId) {
		DebrisImageEntity foundImage = debrisImageDAO.findByIdWithValidation(imageId);
		if (foundImage.getDebrisPost().getId() != debrisPostEntity.getId()) {
			throw new BadRequestException(String.format("Debris id=%d not contain DebrisImage id=%d",
					debrisPostEntity.getId(), imageId));
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
		return Response.ok(debrisPostEntity.getDebrisImages()).build();
	}

	@POST
	public Response addUploadedImageWithId(@NotNull List<@Valid IdOnly> debrisImageRequests) {


		for (IdOnly debrisImageRequest : debrisImageRequests) {
			DebrisImageEntity debrisImageEntity = debrisImageDAO.findByIdWithValidation(debrisImageRequest.getId());

			// validate debris image
			if (debrisImageEntity.getDebrisPost() != null
					&& debrisImageEntity.getDebrisPost().getId() != debrisPostEntity.getId()) {
				throw new BadRequestException(String.format("DebrisImage id=%d is already belongs to Debris id=%d",
						debrisImageEntity.getId(),
						debrisImageEntity.getDebrisPost().getId()));
			}

//			debrisImageEntity.setDebrisPost(debrisPostEntity);
//			debrisImageDAO.merge(debrisImageEntity);
			// TODO: 3/23/19 why this works without any cascade ?
			debrisPostEntity.addDebrisImage(debrisImageEntity);
		}

//		return Response.status(Response.Status.CREATED).entity(debrisPostDAO.findByID(debrisPostEntity.getId())).build();
		return Response.status(Response.Status.CREATED).entity(debrisPostDAO.merge(debrisPostEntity)).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	public Response deleteImage(@PathParam("id") long imageId) {

		DebrisImageEntity foundImage = validateImage(imageId);

		// TODO: 3/4/19 delete from bucket server

		if (debrisPostEntity.getDebrisImages().size() <= 1) {
			throw new BadRequestException("There must be at least 1 image");
		}



		//check if delete thumbnail image
		if (debrisPostEntity.getThumbnailImage() != null && debrisPostEntity.getThumbnailImage().getId() == imageId) {
			//set thumbnail to another image
			debrisPostEntity.setThumbnailImage(debrisPostEntity.getDebrisImages().stream().filter(
					debrisImageEntity -> debrisImageEntity.getId() != imageId
			).findAny().orElseThrow(() -> new BadRequestException("You are deleting thumbnail with no other replacement")));
			debrisPostEntity = debrisPostDAO.merge(debrisPostEntity);
		}

		debrisImageDAO.delete(foundImage);
		return Response.ok().build();
	}
}
