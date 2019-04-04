package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.util.Collection;
import java.util.List;

public abstract class EquipmentRequest {

	@NotNull
	public String name;

	@NotNull
	public Integer dailyPrice;


	// TODO: 3/4/19 validate ths ?
	public String description;


	@NotNull
	@Valid
	public IdOnly thumbnailImage;

	public String address;
	@NotNull
	@Min(-90)
	@Max(90)
	public Double latitude;
	@NotNull
	@Min(-180)
	@Max(180)
	public Double longitude;

	@NotNull
	@Valid
	public IdOnly equipmentType;
	@Valid
	@NotNull
	public List<AvailableTimeRangeRequest> availableTimeRanges;


	public EquipmentRequest() {
	}

	//take this information from token
//	@NotNull
//	@Valid
//	public IdOnly contractor;


	//not crud construction anymore
//	public IdOnly construction;






}
