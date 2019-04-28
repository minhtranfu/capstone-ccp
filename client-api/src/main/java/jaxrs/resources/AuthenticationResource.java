package jaxrs.resources;

import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import daos.ContractorAccountDAO;
import daos.ContractorDAO;
import daos.NotificationDAO;
import dtos.Credentials;
import dtos.requests.ChangePasswordRequest;
import dtos.requests.ContractorRequest;
import dtos.requests.RefreshCredentials;
import dtos.requests.RegisterRequest;
import dtos.responses.AuthenResponse;
import dtos.responses.RegisterResponse;
import dtos.responses.TokenContractorResponse;
import dtos.responses.TokenWrapper;
import entities.ContractorAccountEntity;
import entities.ContractorEntity;
import jaxrs.providers.MPJWTConfigurationProvider;
import org.mindrot.jbcrypt.BCrypt;
import utils.ModelConverter;
import utils.TokenUtil;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.security.interfaces.RSAPublicKey;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.logging.Logger;

@Path("authen")
@Produces(MediaType.APPLICATION_JSON)
public class AuthenticationResource {
	public static final Logger LOGGER = Logger.getLogger(AuthenticationResource.class.toString());

	private static final long DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME = 60*5; // 5 mins
	private static final long DEFAULT_REFRESH_TOKEN_EXPIRE_TIME = 60 * 60 * 24 * 90; // 90 days

	@Inject
	ModelConverter modelConverter;
	@Inject
	ContractorDAO contractorDAO;
	@Inject
	NotificationDAO notificationDAO;


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


		final long expiresIn = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME; // still in seconds

		String token = issueToken(contractorAccount, expiresIn);
		String refreshToken = issueToken(contractorAccount, DEFAULT_REFRESH_TOKEN_EXPIRE_TIME);
		AuthenResponse authenResponse = new AuthenResponse();
		authenResponse.setContractor(prepareContractorResponse(contractorAccount.getContractor()));
		authenResponse.setUsername(username);
		authenResponse.setTokenWrapper(new TokenWrapper(
				token,
				refreshToken,
				"bearer",
				expiresIn,
				"contractor"
		));


		return Response.ok(authenResponse).build();
	}

	private TokenContractorResponse prepareContractorResponse(ContractorEntity contractorEntity) {
		TokenContractorResponse tokenContractorResponse = modelConverter.toTokenContractorResponse(contractorEntity);
		tokenContractorResponse.setTotalUnreadNotifications(notificationDAO.getTotalUnreadNotification(contractorEntity.getId()));
		return tokenContractorResponse;
	}
	private String issueToken(ContractorAccountEntity account, long expiresIn) throws Exception {
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
				.claim("contractorId", new Long(account.getContractor().getId()))
				.subject("" + account.getContractor().getId())
				.issuer(MPJWTConfigurationProvider.ISSUED_BY)
				.build();

		String token = TokenUtil.generateTokenString(claimsSet.toJSONObject(), null, new HashMap<String, Long>() {{
			put("exp", expires);
		}});

		return token;


	}

	private ContractorAccountEntity authenticate(String username, String password) {
		// Throw an Exception if the credentials are invalid

		List<ContractorAccountEntity> accountsByUsernamePassword = contractorAccountDAO.findByUsername(username);
		if (accountsByUsernamePassword == null || accountsByUsernamePassword.size() == 0) {
			throw new ForbiddenException(String.format("incorrect username=%s", username));
		}
		for (ContractorAccountEntity contractorAccountEntity : accountsByUsernamePassword) {
			if (BCrypt.checkpw(password, contractorAccountEntity.getPassword())) {

				return contractorAccountEntity;
			}
		}

		throw new ForbiddenException("Password not correct");
	}


	@POST
	@Path("register")
	public Response register(@NotNull @Valid RegisterRequest registerRequest) {


		Credentials credentials = registerRequest.credentials;
		ContractorRequest contractorRequest = registerRequest.contractor;

		// hash password
		String hashedPassword = BCrypt.hashpw(credentials.getPassword(), BCrypt.gensalt());
		credentials.setPassword(hashedPassword);


		// check username password
		List<ContractorAccountEntity> accountsByUsername = contractorAccountDAO.findByUsername(
				credentials.getUsername()
		);

		if (accountsByUsername != null && accountsByUsername.size() > 0) {
			throw new BadRequestException(String.format("username='%s' already exist", credentials.getUsername()));
		}

		validateContractor(contractorRequest);

		//persist account
		ContractorEntity contractorEntity = modelConverter.toEntity(contractorRequest);
		ContractorAccountEntity contractorAccountEntity = modelConverter.toEntity(credentials);

		contractorAccountEntity.setContractor(contractorEntity);
		contractorAccountDAO.persist(contractorAccountEntity);
//		contractorDAO.persist(contractorEntity);

		RegisterResponse registerResponse = new RegisterResponse();
		registerResponse.contractor = contractorDAO.findByID(contractorEntity.getId());
		registerResponse.username = credentials.getUsername();


		return Response.status(Response.Status.CREATED).entity(registerResponse).build();
//		return Response.status(Response.Status.CREATED).build();


	}

	private void validateContractor(ContractorRequest contractorRequest) {
		//now we have nothing to validate
		return;
	}

	@POST
	@Path("changePassword")
	public Response changePassword(@Valid ChangePasswordRequest changePasswordRequest) throws Exception {
		// TODO: 3/31/19 authen useranem password
		String username = changePasswordRequest.getUsername();
		String password = changePasswordRequest.getPassword();
		String newPassword = changePasswordRequest.getNewPassword();

		ContractorAccountEntity contractorAccount = authenticate(username, password);
		if (contractorAccount.getContractor() == null) {
			throw new BadRequestException(String.format("account %s not mapped with any contractor profile",
					contractorAccount.getUsername()));
		}

		// TODO: 3/31/19 set new password
		String hashedNewPassword = BCrypt.hashpw(newPassword, BCrypt.gensalt());

		contractorAccount.setPassword(hashedNewPassword);
		contractorAccountDAO.merge(contractorAccount);


		// TODO: 3/31/19 return new token
		final long expiresIn = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME; // still in seconds

		String token = issueToken(contractorAccount, expiresIn);
		String refreshToken = issueToken(contractorAccount, DEFAULT_REFRESH_TOKEN_EXPIRE_TIME);
		AuthenResponse authenResponse = new AuthenResponse();
		authenResponse.setContractor(prepareContractorResponse(contractorAccount.getContractor()));
		authenResponse.setUsername(username);
		authenResponse.setTokenWrapper(new TokenWrapper(
				token,
				refreshToken,
				"bearer",
				expiresIn,
				"contractor"
		));


		return Response.ok(authenResponse).build();

	}

	@POST
	@Path("refresh")
	public Response authenWithRefreshToken(@Valid RefreshCredentials refreshCredentials) throws Exception {

		String refreshToken = refreshCredentials.getRefreshToken();
		final RSAPublicKey rsaPublicKey = (RSAPublicKey) TokenUtil.readPublicKey("/publicKey.pem");
		;

		RSASSAVerifier rsassaVerifier = new RSASSAVerifier(rsaPublicKey);

		JWSObject jwsObject = JWSObject.parse(refreshToken);
		if (!jwsObject.verify(rsassaVerifier)) {
			throw new ForbiddenException("Access token not verified");
		}
		LOGGER.info("Verified, payload=" + jwsObject.getPayload().toString());
		JWTClaimsSet claimsSet = JWTClaimsSet.parse(jwsObject.getPayload().toString());

		LocalDateTime issuedAtTime = LocalDateTime.ofInstant(claimsSet.getIssueTime().toInstant(), ZoneId.systemDefault());
		LocalDateTime expiredTime = LocalDateTime.ofInstant(claimsSet.getExpirationTime().toInstant(), ZoneId.systemDefault());


		String username = claimsSet.getStringClaim("username");

		// 3/31/19 validate refresh token
		ContractorAccountEntity accountEntity = contractorAccountDAO.findByUsername(username).stream().findAny()
				.orElseThrow(() -> new BadRequestException("Username not available"));

		if (accountEntity.getUpdatedTime().isAfter(issuedAtTime)) {
			//  3/31/19 password changed, refresh token expired
			throw new ForbiddenException("Password changed, please login to get new refresh token!");
		}
		if (LocalDateTime.now().isAfter(expiredTime)) {
			//  3/31/19 expired time
			throw new ForbiddenException("Refresh token expired, please login to get new refresh token");
		}

		final long expiresIn = DEFAULT_ACCESS_TOKEN_EXPIRATION_TIME; // still in seconds

		String token = issueToken(accountEntity, expiresIn);

		AuthenResponse authenResponse = new AuthenResponse();
		authenResponse.setContractor(prepareContractorResponse(accountEntity.getContractor()));
		authenResponse.setUsername(username);
		authenResponse.setTokenWrapper(new TokenWrapper(
				token,
				refreshToken,
				"bearer",
				expiresIn,
				"contractor"
		));
		return Response.ok(authenResponse).build();
	}



//	@POST
//	@Path("register")
//	public Response register(@Valid Credentials credentials) {
//
//	}


}
