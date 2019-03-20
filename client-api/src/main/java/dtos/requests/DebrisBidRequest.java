package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisTransactionEntity;

import javax.json.bind.annotation.JsonbNillable;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class DebrisBidRequest {
	@NotNull
	private Double price;

	private String description = "";


	@NotNull
	@Valid
	private IdOnly debrisPost;

	public DebrisBidRequest() {
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}


	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public IdOnly getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(IdOnly debrisPost) {


		this.debrisPost = debrisPost;
	}

	@Override
	public String toString() {
		return "DebrisBidRequest{" +
				"price=" + price +
				", description='" + description + '\'' +
				", debrisPost=" + debrisPost +
				'}';
	}
}
