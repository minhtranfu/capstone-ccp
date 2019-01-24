package dtos;

import entities.EquipmentEntity;
import entities.LocationEntity;

public class EquipmentDTO extends EquipmentEntity {
	private double distance;
	private LocationEntity currentLocation;

	public EquipmentDTO() {
	}

	public EquipmentDTO(LocationEntity currentLocation) {
		this.currentLocation = currentLocation;
	}

	public double getDistance() {
		// TODO: 1/24/19 calculate distance

		return -1;
	}

	public void setDistance(double distance) {
		this.distance = distance;
	}

	public LocationEntity getCurrentLocation() {
		return currentLocation;
	}

	public void setCurrentLocation(LocationEntity currentLocation) {
		this.currentLocation = currentLocation;
	}
}
