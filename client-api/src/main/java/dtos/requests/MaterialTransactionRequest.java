package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.MaterialTransactionDetailEntity;

import javax.validation.Valid;
import javax.validation.constraints.*;
import java.util.List;

public class MaterialTransactionRequest {


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

	@Valid
	private IdOnly requester;

	@NotNull
	private List<@Valid MaterialTransactionDetailRequest> materialTransactionDetails;


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



	public IdOnly getRequester() {
		return requester;
	}

	public void setRequester(IdOnly requester) {
		this.requester = requester;
	}



	public List<MaterialTransactionDetailRequest> getMaterialTransactionDetails() {
		return materialTransactionDetails;
	}

	public void setMaterialTransactionDetails(List<MaterialTransactionDetailRequest> materialTransactionDetails) {
		this.materialTransactionDetails = materialTransactionDetails;
	}
}
