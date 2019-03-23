package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.*;

public class MaterialTransactionRequest {

	@Positive
	private Double price;

	@Positive
	@NegativeOrZero
	private Double quantity;

	@NotNull
	@NotBlank
	private String requesterAddress;

	@NotNull
	@Min(-90)
	@Max(90)
	private Double requesterLat;

	@NotNull
	@Min(-180)
	@Max(180)
	private Double requesterLong;


	@NotNull
	@Valid
	private IdOnly material;

	@Valid
	private IdOnly requester;

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Double getQuantity() {
		return quantity;
	}

	public void setQuantity(Double quantity) {
		this.quantity = quantity;
	}

	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	public Double getRequesterLat() {
		return requesterLat;
	}

	public void setRequesterLat(Double requesterLat) {
		this.requesterLat = requesterLat;
	}

	public Double getRequesterLong() {
		return requesterLong;
	}

	public void setRequesterLong(Double requesterLong) {
		this.requesterLong = requesterLong;
	}


	public IdOnly getMaterial() {
		return material;
	}

	public void setMaterial(IdOnly material) {
		this.material = material;
	}

	public IdOnly getRequester() {
		return requester;
	}

	public void setRequester(IdOnly requester) {
		this.requester = requester;
	}
}
