package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EquipmentPriceSuggestionRequest {

	@NotNull
	@Valid
	private IdOnly equipmentType;

	@NotNull
	private List<@Valid AdditionalSpecsValueRequest> additionalSpecsValues;

	public EquipmentPriceSuggestionRequest() {
	}

	public IdOnly getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(IdOnly equipmentType) {
		this.equipmentType = equipmentType;
	}

	public List<AdditionalSpecsValueRequest> getAdditionalSpecsValues() {
		return additionalSpecsValues;
	}

	public void setAdditionalSpecsValues(List<AdditionalSpecsValueRequest> additionalSpecsValues) {
		this.additionalSpecsValues = additionalSpecsValues;
	}
}
