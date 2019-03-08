package jaxrs.resources;

import com.nimbusds.jwt.JWTClaimsSet;
import daos.ContractorAccountDAO;
import dtos.Credentials;
import entities.ContractorAccountEntity;
import jaxrs.providers.MPJWTConfigurationProvider;
import utils.TokenUtil;

import javax.inject.Inject;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@Path("authen")
@Produces(MediaType.APPLICATION_JSON)
public class AuthenticationResource {

	@Inject
	ContractorAccountDAO contractorAccountDAO;

	@POST
	public Response authenticateUser(Credentials credentials) throws Exception {
		String username = credentials.getUsername();
		String password = credentials.getPassword();


		ContractorAccountEntity contractor = authenticate(username, password);
		if (contractor.getContractor() == null) {
			throw new BadRequestException(String.format("account %s not mapped with any contractor profile",
					contractor.getUsername()));
		}
		String token = issueToken(contractor);
		return Response.ok(token).build();
	}

	private String issueToken(ContractorAccountEntity contractor) throws Exception {
		// TODO: 3/6/19 generate token here
		final List<String> scopes = new ArrayList<>();
		scopes.add("contractor");

//		return AuthenticationFilter.DEFAULT_TESTING_TOKEN;
//		return "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMiIsIm5hbWUiOiJOZ2hpYSIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImdyb3VwcyI6WyJjb250cmFjdG9yIl19.Le9Dz0-rj_ySaOWd51vsAXWzJ5ouB2QHDkmSMUX0lXw";
		final JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
				.jwtID(UUID.randomUUID().toString())
				.claim("groups", scopes)
				.claim("username", contractor.getUsername())
				.subject(contractor.getUsername())
				.claim("id", contractor.getContractor().getId())
				.issuer(MPJWTConfigurationProvider.ISSUED_BY)
				.build();
		return TokenUtil.generateTokenString(claimsSet.toJSONObject(), null, new HashMap());

	}

	private ContractorAccountEntity authenticate(String username, String password) {
		// Authenticate against a database, LDAP, file or whatever
		// Throw an Exception if the credentials are invalid

		List<ContractorAccountEntity> accountsByUsernamePassword = contractorAccountDAO.findAccountsByUsernamePassword(username, password);
		if (accountsByUsernamePassword == null || accountsByUsernamePassword.size() == 0) {
			throw new ForbiddenException("incorrect username or password ");
		}
		return accountsByUsernamePassword.get(0);
	}


}
