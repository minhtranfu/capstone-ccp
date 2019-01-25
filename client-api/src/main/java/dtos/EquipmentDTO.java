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

		return calculateDistance(this.currentLocation, getLocation());
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

	public static double calculateDistance(LocationEntity location1, LocationEntity location2) {
		// TODO: 1/24/19 calculate distance
		return Math.sqrt(Math.pow(location1.getLatitude() - location2.getLatitude(), 2)
				+ Math.pow(location1.getLongitude() - location2.getLongitude(), 2));
	}
}
