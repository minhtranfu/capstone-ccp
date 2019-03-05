package dtos.requests;

import entities.EquipmentEntity;

import javax.validation.constraints.NotNull;

public class DescriptionImageRequest {

	
	public long id;
	@NotNull
	public String url;

}
