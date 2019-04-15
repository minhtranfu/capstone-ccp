package jaxrs.resources;

import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import daos.ContractorVerifyingImageDAO;
import daos.DebrisImageDAO;
import daos.EquipmentImageDAO;
import dtos.responses.MessageResponse;
import entities.ContractorVerifyingImageEntity;
import entities.DebrisImageEntity;
import entities.EquipmentImageEntity;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.ContentDisposition;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import utils.Constants;
import utils.ImageUtil;
//todo configure alternative for this shit
//import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
//import org.glassfish.jersey.media.multipart.FormDataParam;

import javax.inject.Inject;
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

	@Inject
	DebrisImageDAO debrisImageDAO;

	@Inject
	EquipmentImageDAO equipmentImageDAO;

	@Inject
	ContractorVerifyingImageDAO contractorVerifyingImageDAO;

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
		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		List<String> urlList = ImageUtil.uploadImages(credentialPath, attachmentList);
		return Response.ok(urlList).build();
	}

	@POST
	@Path("single")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response createSingleFile(@Multipart("file") InputStream uploadedInputStream,
									 @Multipart("file") Attachment attachment) throws IOException {

		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		ArrayList<Attachment> attachments = new ArrayList<>();
		attachments.add(attachment);
		List<String> urls = ImageUtil.uploadImages(credentialPath, attachments);
		return Response.ok(urls).build();
	}

	@POST
	@Path("debrisImages")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadTempDebrisImages(List<Attachment> attachmentList) throws IOException {
		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		List<String> urlList = ImageUtil.uploadImages(credentialPath, attachmentList);
		List<DebrisImageEntity> resultList = new ArrayList<>();

		for (String url : urlList) {
			DebrisImageEntity debrisPostImageEntity = new DebrisImageEntity();
			debrisPostImageEntity.setUrl(url);
			debrisImageDAO.persist(debrisPostImageEntity);
			resultList.add(debrisPostImageEntity);
		}
		return Response.status(Response.Status.CREATED).entity(resultList).build();
	}

	@POST
	@Path("equipmentImages")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadTempEquipmentImages(List<Attachment> attachmentList) throws IOException {
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

	@POST
	@Path("contractorVerifyingImages")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadTempContractorVerifyingImages(List<Attachment> attachmentList) throws IOException {
		String credentialPath = servletContext.getRealPath("/WEB-INF/" + Constants.CREDENTIAL_JSON_FILENAME);
		List<String> urlList = ImageUtil.uploadImages(credentialPath, attachmentList);
		List<ContractorVerifyingImageEntity> resultList = new ArrayList<>();

		for (String url : urlList) {
			ContractorVerifyingImageEntity contractorVerifyingImageEntity = new ContractorVerifyingImageEntity();
			contractorVerifyingImageEntity.setUrl(url);
			contractorVerifyingImageDAO.persist(contractorVerifyingImageEntity);
			resultList.add(contractorVerifyingImageEntity);
		}
		return Response.status(Response.Status.CREATED).entity(resultList).build();
	}



}
