package test.shit;


import daos.EquipmentDAO;
import dtos.requests.EquipmentPutRequest;
import dtos.validationObjects.LocationValidator;
import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentRequest;
import entities.EquipmentEntity;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.JsonWebToken;
import utils.ModelConverter;

import javax.annotation.Resource;
import javax.annotation.security.DenyAll;
import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.servlet.http.HttpServlet;
import javax.validation.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Path("cdiTest")
@Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
@RequestScoped
public class TestResource  {


	@Inject
	Message messageB;

	@Inject
	TestDAO testDAO;

	@Inject
	EquipmentDAO equipmentDAO;
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
	@PUT
	@Path("equipment/{id:\\d+}")
	public Response testPutEquipment(@PathParam("id") long equipmentId, @Valid EquipmentPutRequest equipmentRequest) {

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(equipmentId);
		 modelConverter.toEntity(equipmentRequest,foundEquipment );

		return Response.ok(foundEquipment).build();
	}

//	@PUT
//	@Path("equipment")
//	public Response testSaveOrMupdateEquipment(@Valid EquipmentPutRequest equipmentPutRequest) {
//
//
//
//
//	}
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

	public void validateLocationData(@NotNull @NotBlank @Size(min = 3) String address, @NotNull double latitude, @NotNull double longitude) {
	}


	@Resource
	Validator validator;
	@GET
	@Path("validate")
	public Response testValidation(LocationValidator validatioObject) throws NoSuchMethodException {
		;
		Set<ConstraintViolation<LocationValidator>> validate = validator.validate(validatioObject);



		if (!validate.isEmpty()) {
			throw new ConstraintViolationException(validate);
		}

		return Response.ok().build();
	}


	@Inject
	private JsonWebToken jsonWebToken;
	@GET
	@Path("authen")
//	@PermitAll
	@RolesAllowed("contractor")
//	@DenyAll
	public Response testAuthenByJWT() {
		return Response.ok(toIdentityString()).build();
	}

	@Claim("username")
	String username;

	@Claim("id")
	long contractorId;

	@Claim
	String name;
	private String toIdentityString() {
		if (jsonWebToken == null) {
			return "no authenticated user.";
		}

		final StringBuilder builder = new StringBuilder();

		builder.append(username);
		builder.append(String.format(" (id=%s)", contractorId));
		builder.append(String.format(" (name=%s)", name));
		builder.append(String.format(" (username=%s)", username));
		builder.append(String.format(" (jti=%s)", jsonWebToken.getIssuedAtTime()));
		builder.append(String.format(" (exp=%s)", jsonWebToken.getExpirationTime()));

		builder.append(String.format(" (groups=%s)", StringUtils.join(jsonWebToken.getGroups(), ", ")));
		return builder.toString();
	}


//	@Override
//	public void init() {
//		messageB = new MessageB();
//	}

}