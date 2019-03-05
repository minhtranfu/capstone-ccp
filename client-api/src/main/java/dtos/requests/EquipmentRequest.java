package dtos.requests;

import dtos.IdOnly;
import entities.*;

import javax.json.bind.annotation.JsonbNillable;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
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
	public String thumbnailImage;

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

	// TODO: 3/4/19 chekc this when do description image upload
	@Valid
	@NotNull
	public Collection<DescriptionImageRequest> descriptionImages;


}
