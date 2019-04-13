package dtos.requests;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

public class EquipmentPutRequest extends EquipmentRequest {
	@Valid
	@NotNull
	public List<AdditionalSpecsValueWithIdRequest> additionalSpecsValues;
}
