package dtos.requests;

import dtos.Credentials;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class RegisterRequest {

	@Valid
	@NotNull
	public Credentials credentials;

	@Valid
	@NotNull
	public ContractorRequest contractor;

}
