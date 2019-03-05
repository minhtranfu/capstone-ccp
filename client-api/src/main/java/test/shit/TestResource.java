package test.shit;


import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentRequest;
import entities.EquipmentEntity;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.apache.cxf.jaxrs.ext.multipart.MultipartBody;
import org.modelmapper.ModelMapper;
import utils.ModelConverter;

import javax.inject.Inject;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Path("cdiTest")
@Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
public class TestResource extends HttpServlet {


	@Inject
	Message messageB;

	@Inject
	TestDAO testDAO;

	@Inject
	ModelConverter modelConverter;

	@GET
	public String doGet() {
		return messageB.get();
	}

	@GET
	@Path("dao")
	public Response testDao() {

		return Response.ok(testDAO.testGetFeedbackEntityId(3)).build();
	}

	@GET

	@Path("null")
	public Response testNull() {
		System.out.println("null here ");
		return Response.ok(null).build();
	}

	@POST
	@Path("equipment")
	public Response testPostEquipment(@Valid EquipmentPostRequest equipmentRequest) {
		EquipmentEntity equipmentEntity = modelConverter.toEntity(equipmentRequest);
		EquipmentRequest equipmentRequest1 = modelConverter.toRequest(equipmentEntity);
		return Response.ok(equipmentRequest1).build();
	}

	@POST
	@Path("file")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response testUploadFile(@Multipart("file") InputStream inputStream,
								   @Multipart("file") Attachment attachment
	) {

		return Response.ok(attachment.getContentDisposition().getParameter("filename")).build();
	}

	@POST
	@Path("multifiles")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response testUploadMultipleFiles(List<Attachment> attachmentList) {
		ArrayList<String> names = new ArrayList<>();
		for (Attachment attachment : attachmentList) {
			names.add(attachment.getContentDisposition().getParameter("filename"));
		}
		return Response.ok(names).build();
	}

//	@Override
//	public void init() {
//		messageB = new MessageB();
//	}

}