package dtos.requests;

import entities.EquipmentEntity;

import javax.validation.constraints.NotNull;

public class DescriptionImageRequest {

	@NotNull
	private String url;

}
