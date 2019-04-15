package test.shit;


import com.google.firebase.messaging.FirebaseMessagingException;
import daos.ContractorAccountDAO;
import daos.EquipmentDAO;
import daos.SubscriptionDAO;
import dtos.Credentials;
import dtos.notifications.NotificationDTO;
import dtos.requests.EquipmentPutRequest;
import dtos.validationObjects.LocationValidator;
import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentRequest;
import entities.ContractorAccountEntity;
import entities.EquipmentEntity;
import entities.EquipmentTypeEntity;
import managers.EmailManager;
import managers.FirebaseMessagingManager;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.cxf.jaxrs.ext.multipart.Attachment;
import org.apache.cxf.jaxrs.ext.multipart.Multipart;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.eclipse.microprofile.jwt.JsonWebToken;
import org.mindrot.jbcrypt.BCrypt;
import org.omg.CORBA.PUBLIC_MEMBER;
import utils.ModelConverter;
import utils.NotificationHelper;

import javax.annotation.Resource;
import javax.annotation.security.PermitAll;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Provider;
import javax.mail.MessagingException;
import javax.validation.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.ws.rs.*;
import javax.ws.rs.Path;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringWriter;
import java.sql.Wrapper;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

@Path("cdiTest")
@Produces({MediaType.APPLICATION_JSON, MediaType.TEXT_PLAIN})
@RequestScoped
public class TestResource  {
	public static final Logger LOGGER = Logger.getLogger(TestResource.class.toString());



	@Inject
	Message messageB;

	@Inject
	TestDAO testDAO;

	@Inject
	EquipmentDAO equipmentDAO;
	@Inject
	ModelConverter modelConverter;

	@Inject
	ContractorAccountDAO contractorAccountDAO;

	@Inject
	FirebaseMessagingManager messagingManager;

	@Inject
	EmailManager emailManager;

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
		System.out.println("null here !");
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



	@Context
	SecurityContext securityContext;

	@Inject
	Provider<JsonWebToken> jsonWebToken;

	@Inject
	@Claim("username")
	ClaimValue<String> username;


	@GET
	@Path("authen")
	@PermitAll
//	@RolesAllowed("contractor")
//	@DenyAll
	public Response testAuthenByJWT() {
//		securityContext.getUserPrincipal();
		return Response.ok(
				username.getValue()
//				toIdentityString()
		).build();
	}

	@GET
	@Path("authen/notoken")
	public Response testAuthenWithoutJWT() {
		return Response.ok().build();
	}
	private String toIdentityString() {
//		JsonWebToken jsonWebToken = (JsonWebToken) securityContext.getUserPrincipal();
		JsonWebToken jsonWebToken = this.jsonWebToken.get();
		if (jsonWebToken == null) {
			return "no authenticated user.";
		}

		final StringBuilder builder = new StringBuilder();

		builder.append(String.format(" (contractorId=%s)", jsonWebToken.claim("sub").orElse(0)));
		builder.append(String.format(" (name=%s)", jsonWebToken.claim("name").orElse("not availalbe")));
		builder.append(String.format(" (username=%s)", jsonWebToken.claim("username").orElse("not available")));
		builder.append(String.format(" (jti=%s)", jsonWebToken.getIssuedAtTime()));
		builder.append(String.format(" (exp=%s)", jsonWebToken.getExpirationTime()));
		builder.append(String.format(" (groups=%s)", StringUtils.join(jsonWebToken.getGroups(), ", ")));
		return builder.toString();
	}

	@GET
	@Path("noti/http")
	public Response testPushNotiWithHttpLegacyMethod() throws IOException {
		InputStream inputStream = messagingManager.sendNotiWithHTTP();
		StringWriter stringWriter = new StringWriter();
		IOUtils.copy(inputStream, stringWriter);
		return Response.ok(stringWriter.toString()).build();
	}

	@GET
	@Path("noti")
	public Response testPushNoti() throws FirebaseMessagingException {
		String response = messagingManager.sendNotification();
		return Response.ok(response).build();
	}

	@GET
	@Path("expo")
	public Response testPushNotiExpo() throws IOException {
		NotificationDTO notificationDTO = new NotificationDTO();
		notificationDTO.setTitle("test");
		notificationDTO.setContent("testBody");
		return Response.ok(messagingManager.sendExpo(notificationDTO,"ExponentPushToken[4SfrLEChNrtCnwgRHZcAFV]")).build();
	}


	@Inject
	SubscriptionDAO subscriptionDAO;

	@GET
	@Path("subscriptionMatched")
	public Response testmatchedSubscription() {
		EquipmentEntity equipmentEntity = new EquipmentEntity();
		equipmentEntity.setId(40);
		equipmentEntity.setDailyPrice(12);
		EquipmentTypeEntity equipmentTypeEntity = new EquipmentTypeEntity();
		equipmentEntity.setId(4);

		equipmentEntity.setEquipmentType(equipmentTypeEntity);
		;
		return Response.ok(subscriptionDAO.getMatchedSubscriptions(equipmentEntity)).build();
	}


	@GET
	@Path("testLog")
	public Response testLog() {
		LOGGER.finest("FINEST");
		LOGGER.finer("finner");
		LOGGER.fine("fine");
		LOGGER.info("info");
		LOGGER.warning("warning");
		LOGGER.severe("severe");
		return Response.ok().build();
	}

	@POST
	@Path("hashing/changeAll")
	public Response changeAllPassword(Credentials credentials) {
		String password = credentials.getPassword();
		List<ContractorAccountEntity> all = contractorAccountDAO.findAll();
		for (ContractorAccountEntity contractorAccountEntity : all) {
			String hashpw = BCrypt.hashpw(password, BCrypt.gensalt());
			contractorAccountEntity.setPassword(hashpw);
			contractorAccountDAO.merge(contractorAccountEntity);
		}
		return Response.ok(all).build();
	}


	@POST
	@Path("email/test")
	public Response sendTestingEmail() throws IOException, MessagingException {
		emailManager.sendmail("Testing from nghia","Testing content from nghia\nTesting content from nghia\nTesting content from nghia\n","luuquangnghia97@gmail.com");
		return Response.ok().build();
	}

}