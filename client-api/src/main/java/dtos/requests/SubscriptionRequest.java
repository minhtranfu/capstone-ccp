package dtos.requests;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.EquipmentTypeEntity;

import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class SubscriptionRequest {
	private long id;

	//can be null
	@Valid
	private IdOnly equipmentType;

	//can be null
	@Positive
	private Double maxPrice;
	@NotNull
	private LocalDate beginDate;
	@NotNull
	private LocalDate endDate;

	//can be null
	@Positive
	private Double maxDistance;

	//can be null if maxDistance is null

	@Min(-90)
	@Max(90)
	private Double latitude;

	@Min(-180)
	@Max(180)
	private Double longitude;

	private String address;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public IdOnly getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(IdOnly equipmentType) {
		this.equipmentType = equipmentType;
	}



	public Double getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(Double maxPrice) {
		this.maxPrice = maxPrice;
	}

	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Double getMaxDistance() {
		return maxDistance;
	}

	public void setMaxDistance(Double maxDistance) {
		this.maxDistance = maxDistance;
	}

	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
}
