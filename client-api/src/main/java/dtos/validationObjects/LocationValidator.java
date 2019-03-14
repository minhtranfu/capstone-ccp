package dtos.validationObjects;

import javax.validation.constraints.*;

public class LocationValidator {
	@NotNull
	@NotEmpty
	@Size(min = 3)
	private String address;
	@NotNull
	@NotNull
	@Min(-180)
	@Max(180)
	private Double longitude;
	@NotNull
	@NotNull
	@Min(-90)
	@Max(90)
	private Double latitude;


	public LocationValidator() {
	}

	public LocationValidator(@NotNull @NotEmpty @Size(min = 3) String address, @NotNull Double longitude,  @NotNull Double latitude) {
		this.address = address;
		this.longitude = longitude;
		this.latitude = latitude;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public  Double getLongitude() {
		return longitude;
	}

	public void setLongitude( Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude( Double latitude) {
		this.latitude = latitude;
	}
}
