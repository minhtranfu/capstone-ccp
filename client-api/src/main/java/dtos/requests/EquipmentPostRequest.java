package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;

public class EquipmentPostRequest extends EquipmentRequest {
	// TODO: 3/4/19 chekc this when do description image upload
	@Valid
	@NotNull
	public Collection<IdOnly> equipmentImages;

	@Valid
	@NotNull
	public List<AdditionalSpecsValueRequest> additionalSpecsValues;

}
