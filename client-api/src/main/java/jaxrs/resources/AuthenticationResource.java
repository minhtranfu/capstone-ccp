package jaxrs.resources;

import com.nimbusds.jwt.JWTClaimsSet;
import daos.ContractorAccountDAO;
import dtos.Credentials;
import dtos.responses.AuthenResponse;
import dtos.responses.TokenWrapper;
import entities.ContractorAccountEntity;
import jaxrs.providers.MPJWTConfigurationProvider;
import utils.TokenUtil;

import javax.inject.Inject;
import javax.validation.Valid;
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
	private static final long DEFAULT_EXPIRATION_TIME = 300;


	@Inject
	ContractorAccountDAO contractorAccountDAO;

	@POST
	public Response authenticateUser(@Valid Credentials credentials) throws Exception {
		String username = credentials.getUsername();
		String password = credentials.getPassword();


		ContractorAccountEntity contractorAccount = authenticate(username, password);
		if (contractorAccount.getContractor() == null) {
			throw new BadRequestException(String.format("account %s not mapped with any contractor profile",
					contractorAccount.getUsername()));
		}
		final long expiresIn = DEFAULT_EXPIRATION_TIME; // still in seconds

		String token = issueToken(contractorAccount,expiresIn);
		AuthenResponse authenResponse = new AuthenResponse();
		authenResponse.setContractor(contractorAccount.getContractor());
		authenResponse.setUsername(username);
		authenResponse.setTokenWrapper(new TokenWrapper(
				token,
				"bearer",
				expiresIn,
				"contractor"
		));



		return Response.ok(authenResponse).build();
	}

	private String issueToken(ContractorAccountEntity account, long expiresIn ) throws Exception {
		// TODO: 3/6/19 generate token here
		final List<String> scopes = new ArrayList<>();
		scopes.add("contractor");

		final int currentTimeInSecs = TokenUtil.currentTimeInSecs();
		final long expires = currentTimeInSecs + expiresIn;

		final JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
				.jwtID(UUID.randomUUID().toString())
				.claim("groups", scopes)
				.claim("username", account.getUsername())
				.claim("name", account.getContractor().getName())
				.claim("contractorId",new Long(account.getContractor().getId()))
				.subject(""+account.getContractor().getId())
				.issuer(MPJWTConfigurationProvider.ISSUED_BY)
				.build();

		String token =  TokenUtil.generateTokenString(claimsSet.toJSONObject(), null, new HashMap<String, Long>() {{
			put("exp", expires);
		}});

		return token;


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


//	@POST
//	@Path("register")
//	public Response register(@Valid Credentials credentials) {
//
//	}


}
