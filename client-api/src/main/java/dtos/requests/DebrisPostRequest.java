package dtos.requests;

import dtos.IdOnly;
import entities.*;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class DebrisPostRequest {

	@NotNull
	@NotBlank
	private String title;

	@NotNull
	@NotBlank
	private String address;

	@Max(180)
	@Min(-180)
	@NotNull
	private Double longitude;

	@NotNull
	@Max(90)
	@Min(-90)
	private Double latitude;

	private String description;

	@NotNull
	private List<@Valid IdOnly> debrisServiceTypes;



	public DebrisPostRequest() {
	}


	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {

		this.description = description;
	}

	public List<IdOnly> getDebrisServiceTypes() {
		return debrisServiceTypes;
	}

	public void setDebrisServiceTypes(List<IdOnly> debrisServiceTypes) {
		this.debrisServiceTypes = debrisServiceTypes;
	}
}
