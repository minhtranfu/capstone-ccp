package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.*;

public class MaterialTransactionDetailRequest {
	@Positive
	@NotNull
	private double quantity;

	@Valid
	@NotNull
	private IdOnly material;

	@Valid
	private IdOnly materialTransaction;

	public MaterialTransactionDetailRequest() {
	}

	public double getQuantity() {
		return quantity;
	}

	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}

	public IdOnly getMaterial() {
		return material;
	}

	public void setMaterial(IdOnly material) {
		this.material = material;
	}

	public IdOnly getMaterialTransaction() {
		return materialTransaction;
	}

	public void setMaterialTransaction(IdOnly materialTransaction) {
		this.materialTransaction = materialTransaction;
	}
}
