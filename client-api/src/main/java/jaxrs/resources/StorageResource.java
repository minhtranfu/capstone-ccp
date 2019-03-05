package jaxrs.resources;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import dtos.responses.MessageResponse;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import utils.Constants;
//todo configure alternative for this shit
//import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
//import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

import static com.google.api.client.util.Charsets.UTF_8;
import static utils.Constants.BUCKET_NAME;


@Path("storage")
@Produces(MediaType.APPLICATION_JSON)
public class StorageResource {

	@Context
	private ServletContext servletContext;


	@GET
	public Response getFiles() throws IOException {

		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);

		Credentials credentials = GoogleCredentials.fromStream(new FileInputStream(credentialPath));
		Storage storage = StorageOptions.newBuilder().setCredentials(credentials)
				.setProjectId("sonic-arcadia-97210").build().getService();

		Bucket bucket = storage.get(BUCKET_NAME);

		String value = "Hello, World!";
		byte[] bytes = value.getBytes(UTF_8);
//            Blob blob = bucket.create("new-file", bytes);
		Blob blob = storage.create(BlobInfo.newBuilder(BUCKET_NAME, "My-new-file.txt").setAcl(new ArrayList<>(Arrays.asList(Acl.of(Acl.User.ofAllUsers(), Acl.Role.READER)))).build(), bytes);

		return Response.ok(blob.getMediaLink()).build();

//            Page<Bucket> pages = storage.list();

//            Page<Blob> pages = bucket.list();
//
//            return Response.ok(pages).build();

	}


	@POST
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadMultiple(List<Attachment> attachmentList) throws IOException {
		ArrayList<String> urlList = new ArrayList<>();
		for (Attachment attachment : attachmentList) {
			ContentDisposition fileDetail = attachment.getContentDisposition();
			InputStream uploadedInputStream = attachment.getObject(InputStream.class);

			final String fileName = fileDetail.getParameter("filename");
			// Check extension of file
			if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
				final String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
				List<String> allowedExt = Arrays.asList("jpg", "jpeg", "png", "gif");

				if (allowedExt.contains(extension)) {
					urlList.add(this.uploadFile(uploadedInputStream, fileDetail));

				} else {
					throw new BadRequestException("file must be an image");

				}
			}
		}

		return Response.ok(urlList).build();
	}

	@POST
	@Path("single")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response createSingleFile(@Multipart("file") InputStream uploadedInputStream,
									 @Multipart("file") Attachment attachment) throws IOException {

		ContentDisposition fileDetail = attachment.getContentDisposition();

		final String fileName = fileDetail.getParameter("filename");
		// Check extension of file
		if (fileName != null && !fileName.isEmpty() && fileName.contains(".")) {
			final String extension = fileName.substring(fileName.lastIndexOf('.') + 1);
			String[] allowedExt = {"jpg", "jpeg", "png", "gif"};
			for (String s : allowedExt) {
				if (extension.equals(s)) {
					return Response.ok(this.uploadFile(uploadedInputStream, fileDetail)).build();
				}
			}
			throw new BadRequestException("file must be an image");
		}

		return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Fail!")).build();
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
