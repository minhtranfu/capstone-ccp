package dtos.requests;

import daos.ContractorDAO;
import daos.NotificationDAO;
import dtos.responses.TokenContractorResponse;
import entities.ContractorEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("token")
public class TokenResource {


	@Inject
	ModelConverter modelConverter;
	@Inject
	ContractorDAO contractorDAO;

	@Inject
	NotificationDAO notificationDAO;
	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	public long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@RolesAllowed("contractor")
	@GET
	@Path("contractor")
	public Response getContractorByToken() {
		ContractorEntity contractorEntity = contractorDAO.findByIdWithValidation(getClaimContractorId());
		TokenContractorResponse response = modelConverter.toTokenContractorResponse(contractorEntity);
		response.setTotalUnreadNotifications(notificationDAO.getTotalUnreadNotification(getClaimContractorId()));

		return Response.ok(response).build();
	}


}
