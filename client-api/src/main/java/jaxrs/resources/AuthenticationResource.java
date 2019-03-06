package jaxrs.resources;

import daos.ContractorAccountDAO;
import dtos.Credentials;
import jaxrs.providers.AuthenticationFilter;

import javax.inject.Inject;
import javax.print.DocFlavor;
import javax.ws.rs.ForbiddenException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("authen")
@Produces(MediaType.APPLICATION_JSON)
public class AuthenticationResource {

	@Inject
	ContractorAccountDAO contractorAccountDAO;

	@POST
	public Response authenticateUser(Credentials credentials) {
		String username = credentials.getUsername();
		String password = credentials.getPassword();


		authenticate(username, password);

		String token = issueToken(username);

		return Response.ok(token).build();
	}

	private String issueToken(String username) {
		// TODO: 3/6/19 generate token here
		return AuthenticationFilter.DEFAULT_TESTING_TOKEN;
	}

	private void authenticate(String username, String password) {
		// Authenticate against a database, LDAP, file or whatever
		// Throw an Exception if the credentials are invalid
		if (!contractorAccountDAO.validateAccount(username, password)) {
			throw new ForbiddenException("incorrect username or password ");
		}

	}


}
