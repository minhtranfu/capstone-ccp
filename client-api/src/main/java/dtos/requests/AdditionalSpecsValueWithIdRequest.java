package dtos.requests;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class AdditionalSpecsValueWithIdRequest extends AdditionalSpecsValueRequest {

	@NotNull
	@Positive
	public long id;


}
