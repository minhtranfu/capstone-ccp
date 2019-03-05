package dtos.validationObjects;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import javax.validation.constraints.Size;

public class LocationValidator {
	@NotNull
	@NotEmpty
	@Size(min = 3)
	private String address;
	@PositiveOrZero
	@NotNull
	private Double longitude;
	@PositiveOrZero
	@NotNull
	private Double latitude;


	public LocationValidator() {
	}

	public LocationValidator(@NotNull @NotEmpty @Size(min = 3) String address, @PositiveOrZero @NotNull Double longitude, @PositiveOrZero @NotNull Double latitude) {
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

	public @PositiveOrZero Double getLongitude() {
		return longitude;
	}

	public void setLongitude(@PositiveOrZero Double longitude) {
		this.longitude = longitude;
	}

	public @PositiveOrZero Double getLatitude() {
		return latitude;
	}

	public void setLatitude(@PositiveOrZero Double latitude) {
		this.latitude = latitude;
	}
}
