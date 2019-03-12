package jaxrs.resources;

import daos.ContractorDAO;
import daos.NotificationDeviceTokenDAO;
import entities.ContractorEntity;
import entities.NotificationDeviceTokenEntity;

import javax.ejb.Stateless;
import javax.inject.Inject;
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
		notificationDeviceTokenDAO.persist(notificationDeviceTokenEntity);

<<<<<<< HEAD
		return Response.ok(contractorDAO.findByID(contractorEntity.getId())).build();
=======
		return Response.ok(contractorDAO.findByID(contractorEntity.getId()).getNotificationDeviceTokens()).build();
>>>>>>> 8a1ad40ff45a36c4250d2c7fdda150974da3d61c
	}

	@DELETE
	@Path("{notiId:\\d+}")
	public Response removeNotiTokenById(@PathParam("notiId") long notiId) {
		NotificationDeviceTokenEntity managedEntity = notificationDeviceTokenDAO.findByIdWithValidation(notiId);
		notificationDeviceTokenDAO.delete(managedEntity);
		return Response.ok().build();
	}
}
