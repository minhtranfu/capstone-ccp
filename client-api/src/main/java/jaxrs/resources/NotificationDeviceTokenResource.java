package jaxrs.resources;

import daos.ContractorDAO;
import daos.NotificationDeviceTokenDAO;
import entities.ContractorEntity;
import entities.NotificationDeviceTokenEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;

import javax.annotation.security.RolesAllowed;
import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.json.bind.JsonbBuilder;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

//@Path("notifications")
@Produces(MediaType.APPLICATION_JSON)
@Stateless
@Path("notificationTokens")
@RolesAllowed("contractor")
public class NotificationDeviceTokenResource {

	@Inject
	private NotificationDeviceTokenDAO notificationDeviceTokenDAO;

	@Inject
	private ContractorDAO contractorDAO;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}




	@GET
	public Response getAllRegisteredToken() {
		ContractorEntity contractorEntity = contractorDAO.findByIdWithValidation(getClaimContractorId());
		return Response.ok(contractorEntity.getNotificationDeviceTokens()).build();
	}

	@GET
	@Path("{notiId:\\d+}")
	public Response getNotiById(@PathParam("notiId") long id) {
		return Response.ok(notificationDeviceTokenDAO.findByIdWithValidation(id)).build();
	}

	@POST
	public Response addNotiToken(@Valid NotificationDeviceTokenEntity request) {

		ContractorEntity contractorEntity = contractorDAO.findByIdWithValidation(getClaimContractorId());
		NotificationDeviceTokenEntity notificationDeviceTokenEntity = new NotificationDeviceTokenEntity();
		notificationDeviceTokenEntity.setContractor(contractorEntity);
		notificationDeviceTokenEntity.setRegistrationToken(request.getRegistrationToken());
		notificationDeviceTokenEntity.setDeviceType(request.getDeviceType());

		NotificationDeviceTokenEntity foundToken = null;
		List<NotificationDeviceTokenEntity> foundTokens = notificationDeviceTokenDAO.findByToken(notificationDeviceTokenEntity.getRegistrationToken(),
				notificationDeviceTokenEntity.getContractor().getId());
		if (foundTokens.isEmpty()) {
			notificationDeviceTokenDAO.persist(notificationDeviceTokenEntity);
			foundToken = notificationDeviceTokenDAO.findByID(notificationDeviceTokenEntity.getId());
		} else {
			foundToken = foundTokens.get(0);
		}
		return Response.ok(foundToken).build();
	}

	@DELETE
	@Path("{notiId:\\d+}")
	public Response removeNotiTokenById(@PathParam("notiId") long notiId) {
		NotificationDeviceTokenEntity managedEntity = notificationDeviceTokenDAO.findByIdWithValidation(notiId);
		notificationDeviceTokenDAO.delete(managedEntity);
		return Response.ok().build();
	}

	@DELETE
	public Response removeTokenByTokenItself(@Valid NotificationDeviceTokenEntity notificationDeviceTokenEntity) {
		ContractorEntity contractorEntity = contractorDAO.findByIdWithValidation(getClaimContractorId());
		int deletedTokens = notificationDeviceTokenDAO.deleteToken(notificationDeviceTokenEntity.getRegistrationToken()
				, contractorEntity.getId());
		return Response.ok(String.format("{\"token_deleted\":%d}", deletedTokens)).build();
	}

}
