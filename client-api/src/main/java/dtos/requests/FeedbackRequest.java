package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.FeedbackEntity;
import entities.FeedbackTypeEntity;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class FeedbackRequest {

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
	public IdOnly feedbackType;
}
