package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;

public abstract class EquipmentRequest {

	@NotNull
	public String name;

	@NotNull

	public Integer dailyPrice;

	@NotNull
	public Integer deliveryPrice;

	// TODO: 3/4/19 validate ths ?
	public String description;


	@NotNull
	@Valid
	public IdOnly thumbnailImage;

	public String address;
	public Double latitude;
	public Double longitude;

	@NotNull
	@Valid
	public IdOnly equipmentType;

	@NotNull
	@Valid
	public IdOnly contractor;


	public IdOnly construction;


	@Valid
	@NotNull
	public List<AvailableTimeRangeRequest> availableTimeRanges;




}
