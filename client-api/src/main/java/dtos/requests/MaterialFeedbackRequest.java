package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.MaterialTransactionDetailEntity;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;

public class MaterialFeedbackRequest {
	@NotNull
	@PositiveOrZero
	@Min(0)
	@Max(5)
	private double rating;

	private String content = "";

	@NotNull
	@Valid
	private IdOnly materialTransactionDetail;

	public MaterialFeedbackRequest() {
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

	public IdOnly getMaterialTransactionDetail() {
		return materialTransactionDetail;
	}

	public void setMaterialTransactionDetail(IdOnly materialTransactionDetail) {
		this.materialTransactionDetail = materialTransactionDetail;
	}
}
