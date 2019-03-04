package dtos.requests;

import dtos.IdOnly;
import entities.AdditionalSpecsFieldEntity;
import entities.EquipmentEntity;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class AdditionalSpecsValueRequest {

	@NotNull
	public String value;

	@Valid
	public IdOnly additionalSpecsField;

}
