package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class ReportRequest {

	@NotNull
	public String content;
	@Valid
	@NotNull
	public IdOnly toContractor;

	//get this from token

//	@Valid
//	@NotNull
//	public IdOnly fromContractor;
	@Valid
	@NotNull
	public IdOnly reportType;
}
