package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;

public class EquipmentFeedbackRequest {
	@NotNull
	@PositiveOrZero
	@Min(0)
	@Max(5)
	private double rating;

	private String content = "";

	@NotNull
	@Valid
	private IdOnly hiringTransaction;

	public EquipmentFeedbackRequest() {
	}

	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public IdOnly getHiringTransaction() {
		return hiringTransaction;
	}

	public void setHiringTransaction(IdOnly hiringTransaction) {
		this.hiringTransaction = hiringTransaction;
	}
}
