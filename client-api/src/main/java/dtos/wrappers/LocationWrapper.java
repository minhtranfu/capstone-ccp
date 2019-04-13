package dtos.wrappers;

public class LocationWrapper {
	private String address;
	private double latitude;
	private double longitude;


	public LocationWrapper(String address, double latitude, double longitude) {
		this.address = address;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	public String getAddress() {
		return address;
	}

	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	public void setAddress(String address) {

		this.address = address;
	}
}
