package jaxrs.resources;

import daos.ContractorDAO;
import daos.NotificationDeviceTokenDAO;
import entities.ContractorEntity;
import entities.NotificationDeviceTokenEntity;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.json.bind.JsonbBuilder;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

//@Path("notifications")
@Produces(MediaType.APPLICATION_JSON)
@Stateless
public class NotificationDeviceTokenResource {

	@Inject
	private NotificationDeviceTokenDAO notificationDeviceTokenDAO;

	@Inject
	private ContractorDAO contractorDAO;

	private ContractorEntity contractorEntity;

	public ContractorEntity getContractorEntity() {
		return contractorEntity;
	}

	public void setContractorEntity(ContractorEntity contractorEntity) {

		this.contractorEntity = contractorEntity;
	}

	@GET
	public Response getAllRegisteredToken() {
		return Response.ok(contractorEntity.getNotificationDeviceTokens()).build();
	}

	@GET
	@Path("{notiId:\\d+}")
	public Response getNotiById(@PathParam("notiId") long id) {
		return Response.ok(notificationDeviceTokenDAO.findByIdWithValidation(id)).build();
	}

	@POST
	public Response addNotiToken(NotificationDeviceTokenEntity request) {

		// TODO: 3/11/19 validate token not dupplicated
		NotificationDeviceTokenEntity notificationDeviceTokenEntity = new NotificationDeviceTokenEntity();
		notificationDeviceTokenEntity.setContractor(contractorEntity);
		notificationDeviceTokenEntity.setRegistrationToken(request.getRegistrationToken());
		notificationDeviceTokenEntity.setDeviceType(request.getDeviceType());
		notificationDeviceTokenDAO.persist(notificationDeviceTokenEntity);
		return Response.ok(notificationDeviceTokenDAO.findByIdWithValidation(notificationDeviceTokenEntity.getId())).build();
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

		int deletedTokens = notificationDeviceTokenDAO.deleteToken(notificationDeviceTokenEntity.getRegistrationToken()
				, contractorEntity.getId());
		return Response.ok(String.format("{token_deleted:%d}", deletedTokens)).build();
	}

}
