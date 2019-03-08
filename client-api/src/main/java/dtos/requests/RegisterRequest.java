package dtos.requests;

import dtos.Credentials;

import javax.validation.Valid;

public class RegisterRequest {
	@Valid
	public Credentials credentials;

	@Valid
	public ContractorRequest contractor;

}
