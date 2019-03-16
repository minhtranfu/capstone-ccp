package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class MaterialRequest {

	@NotNull
	@NotEmpty
	private String name;

	@Positive
	private double price;

	private String thumbnailImageUrl;
	private String unit;
	private String manufacturer;
	private String description;

	@NotNull
	@Valid
	private IdOnly materialType;

	//this get from token
//	@Valid
//	private IdOnly contractor;
	@NotNull
	@Valid
	private IdOnly construction;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}

	public void setThumbnailImageUrl(String thumbnailImageUrl) {
		this.thumbnailImageUrl = thumbnailImageUrl;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}


	public IdOnly getMaterialType() {
		return materialType;
	}

	public void setMaterialType(IdOnly materialType) {

		this.materialType = materialType;
	}

//	public IdOnly getContractor() {
//		return contractor;
//	}
//
//	public void setContractor(IdOnly contractor) {
//		this.contractor = contractor;
//	}

	public IdOnly getConstruction() {
		return construction;
	}

	public void setConstruction(IdOnly construction) {
		this.construction = construction;
	}
}
