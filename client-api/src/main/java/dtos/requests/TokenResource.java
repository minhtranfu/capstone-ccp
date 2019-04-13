package dtos.requests;

import daos.ContractorDAO;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("token")
public class TokenResource {


	@Inject
	ContractorDAO contractorDAO;

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
		return Response.ok(contractorDAO.findByIdWithValidation(getClaimContractorId())).build();
	}
}
