package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.DebrisTransactionEntity;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DebrisFeedbackRequest {

	@NotNull
	@Min(0)
	@Max(5)
	private Double rating;
	private String content;

	@NotNull
	@Valid
	private IdOnly debrisTransaction;

	public DebrisFeedbackRequest() {
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public IdOnly getDebrisTransaction() {
		return debrisTransaction;
	}

	public void setDebrisTransaction(IdOnly debrisTransaction) {
		this.debrisTransaction = debrisTransaction;
	}
}
