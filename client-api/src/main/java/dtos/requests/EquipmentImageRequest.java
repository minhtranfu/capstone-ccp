package dtos.requests;

import entities.EquipmentEntity;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class EquipmentImageRequest {


	@NotNull
	@Positive
	public long id;

}
