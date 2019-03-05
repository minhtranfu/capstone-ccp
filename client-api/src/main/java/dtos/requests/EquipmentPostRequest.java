package dtos.requests;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EquipmentPostRequest extends EquipmentRequest {
	@Valid
	@NotNull
	public List<AdditionalSpecsValueRequest> additionalSpecsValues;

}
