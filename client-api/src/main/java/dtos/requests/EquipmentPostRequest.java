package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;

public class EquipmentPostRequest extends EquipmentRequest {
	// TODO: 3/4/19 check this when do description image upload
	@NotNull
	private List<@Valid IdOnly> equipmentImages;

	@NotNull
	private List<@Valid AdditionalSpecsValueRequest> additionalSpecsValues;

	public EquipmentPostRequest() {
		super();
	}

	public List<IdOnly> getEquipmentImages() {
		return equipmentImages;
	}

	public void setEquipmentImages(List<IdOnly> equipmentImages) {
		this.equipmentImages = equipmentImages;
	}

	public List<AdditionalSpecsValueRequest> getAdditionalSpecsValues() {
		return additionalSpecsValues;
	}

	public void setAdditionalSpecsValues(List<AdditionalSpecsValueRequest> additionalSpecsValues) {
		this.additionalSpecsValues = additionalSpecsValues;
	}
}
