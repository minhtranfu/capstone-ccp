package jaxrs.resources;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import daos.DescriptionImageDAO;
import entities.DescriptionImageEntity;
import entities.EquipmentEntity;
import jdk.nashorn.internal.objects.annotations.Getter;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import utils.Constants;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static utils.Constants.BUCKET_NAME;
import static utils.Constants.CREDENTIAL_JSON_FILENAME;

@Path("image")
@Stateless
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("contractor")

public class DescriptionImageResource {
	private EquipmentEntity equipmentEntity;

	@Context
	ServletContext servletContext;

	@Inject
	DescriptionImageDAO descriptionImageDAO;
	public DescriptionImageResource() {
	}

	public EquipmentEntity getEquipmentEntity() {
		return equipmentEntity;
	}

	public void setEquipmentEntity(EquipmentEntity equipmentEntity) {
		this.equipmentEntity = equipmentEntity;
	}


	private DescriptionImageEntity validateImage(long imageId) {
		DescriptionImageEntity foundImage = descriptionImageDAO.findByIdWithValidation(imageId);
		if (foundImage.getEquipment().getId() != equipmentEntity.getId()) {
			throw new BadRequestException(String.format("Equipment id=%d not contain DescriptionImage id=%d",
					equipmentEntity.getId(), imageId))
					;
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
		return Response.ok(equipmentEntity.getDescriptionImages()).build();
	}

	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadImage(List<Attachment> attachmentList) throws IOException {
		for (Attachment attachment : attachmentList) {
			//validate attachment image
			InputStream uploadedInputStream = attachment.getObject(InputStream.class);
			ContentDisposition fileDetail = attachment.getContentDisposition();
			final String fileName = fileDetail.getParameter("filename");
			// Check extension of file
			if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
				final String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
				List<String> allowedExt = Arrays.asList("jpg", "jpeg", "png", "gif");

				if (allowedExt.contains(extension)) {
					String uploadedUrl = this.uploadFile(uploadedInputStream, fileDetail);


				} else {
					throw new BadRequestException("file must be an image");

				}
			}
		}

		//todo return equipment with new image
		return Response.ok().build();
	}

	@DELETE
	@Path("{id:d\\+}")
	public Response deleteImage(@PathParam("id") long imageId) {

		DescriptionImageEntity foundImage = validateImage(imageId);
		// TODO: 3/4/19 delete from bucket server
		descriptionImageDAO.delete(foundImage);
		return Response.ok().build();
	}


	private String uploadFile(InputStream uploadedInputStream, ContentDisposition fileDetail) throws IOException {
		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		Credentials credentials = null;
		credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
		Storage storage = StorageOptions.newBuilder().setCredentials(credentials)
				.setProjectId("sonic-arcadia-97210").build().getService();

		Bucket bucket = storage.get(BUCKET_NAME);

		DateTimeFormatter dtf = DateTimeFormat.forPattern("YYYY/MM/dd");
		DateTime dt = DateTime.now(DateTimeZone.UTC);
		String folderOfDate = dt.toString(dtf);
		long currentMiliseconds = new Date().getTime();
		String originName = fileDetail.getParameter("filename");
		String fileExtension = originName.substring(originName.lastIndexOf('.') + 1);
		final String fileName = folderOfDate + "/" + currentMiliseconds + "-" + UUID.randomUUID().toString() + "." + fileExtension;

		// the inputstream is closed by default, so we don't need to close it here
		BlobInfo blobInfo =
				storage.create(
						BlobInfo
								.newBuilder(BUCKET_NAME, fileName)
								// Modify access list to allow all users with link to read file
								.setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER))))
								.build(),
						uploadedInputStream);
//          // Get serving url for image - a magic image URL for resize - crop .... For appengine only
//        ImagesService imagesService = ImagesServiceFactory.getImagesService();
//        String imageUrl = imagesService.getServingUrl(ServingUrlOptions.Builder.withGoogleStorageFileName("/gs/" + BUCKET_NAME + "/" + blobInfo.getName()));
//        return imageUrl;

		// return the public download link
		return blobInfo.getMediaLink();
	}
}
