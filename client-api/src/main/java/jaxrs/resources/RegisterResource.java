package jaxrs.resources;

import daos.ContractorAccountDAO;
import daos.ContractorDAO;
import dtos.Credentials;
import dtos.requests.ContractorRequest;
import dtos.requests.RegisterRequest;
import dtos.responses.RegisterResponse;
import entities.ContractorAccountEntity;
import entities.ContractorEntity;
import org.mindrot.jbcrypt.BCrypt;
import org.modelmapper.ModelMapper;
import utils.ModelConverter;

import javax.inject.Inject;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.BadRequestException;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("register")

public class RegisterResource {
	@Inject
	ContractorAccountDAO contractorAccountDAO;
	@Inject
	ContractorDAO contractorDAO;

	@Inject
	ModelConverter modelConverter;

	@GET
	public Response status() {
		return Response.ok().entity("status is good!").build();
	}

	@POST
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





		contractorAccountDAO.persist(contractorAccountEntity);
		contractorDAO.persist(contractorEntity);

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
}
