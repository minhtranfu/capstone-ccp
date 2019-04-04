package jaxrs.resources;

import daos.ContractorDAO;
import daos.NotificationDAO;
import dtos.notifications.NotificationDTO;
import entities.NotificationEntity;
import managers.FirebaseMessagingManager;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import org.json.JSONObject;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("notifications")
@RolesAllowed("contractor")
public class NotificationResource {


	private static final String DEFAULT_RESULT_LIMIT = "100";
	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	@Inject
	FirebaseMessagingManager messagingManager;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	NotificationDAO notificationDAO;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}


	@GET
	public Response getAllNotificationsFromContractor(@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
													  @QueryParam("offset") @DefaultValue("0") int offset) {
		long contractorId = getClaimContractorId();
		contractorDAO.findByIdWithValidation(contractorId);
		return Response.ok(notificationDAO.getNotificationsByContractorId(contractorId, limit, offset)).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getNotificationById(@PathParam("id") long notificationId) {
		return Response.ok(notificationDAO.findByIdWithValidation(notificationId)).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response setReadNotification(@PathParam("id") long notificationId, NotificationEntity request) {
		NotificationEntity managedNotification = notificationDAO.findByIdWithValidation(notificationId);
		managedNotification.setRead(request.isRead());
		return Response.ok(notificationDAO.merge(managedNotification)).build();
	}

	@POST
	@Path("send")
	public Response sendNotification(NotificationEntity request) {
		messagingManager.sendMessage(new NotificationDTO(request.getTitle(), request.getContent(), getClaimContractorId(), request.getClickAction()));
		return Response.ok().build();
	}

	@POST
	@Path("readAll")
	public Response markAllNotiAsRead() {
		long contractorId = getClaimContractorId();
		contractorDAO.findByIdWithValidation(contractorId);

		int updatedRows = notificationDAO.markAllAsRead(contractorId);;
		return Response.ok(new JSONObject().put("totalNotificationsRead", updatedRows).toString()).build();
	}

}
