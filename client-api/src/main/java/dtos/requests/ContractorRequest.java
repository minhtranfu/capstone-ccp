package dtos.requests;

import entities.ContractorEntity;

import javax.validation.constraints.*;

public class ContractorRequest {

	@NotNull
	@NotEmpty
	public String name;

	@NotNull
	@NotEmpty
	@Email
	public String email;

	@NotEmpty
	@Pattern(regexp = "\\+?[0-9]+")
	public String phoneNumber;


//	@NotEmpty
	public String thumbnailImageUrl;


}
