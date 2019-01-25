package entities;

import javax.persistence.*;

@Entity
@Table(name = "location", schema = "capstone_ccp", catalog = "")
public class LocationEntity {
	private long id;
	private String query;
	private Double longitude;
	private Double latitude;


	public LocationEntity() {
	}

	public LocationEntity(String query, Double longitude, Double latitude) {
		this.query = query;
		this.longitude = longitude;
		this.latitude = latitude;
	}

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "query", nullable = true, length = 255)
	public String getQuery() {
		return query;
	}

	public void setQuery(String query) {
		this.query = query;
	}

	@Basic
	@Column(name = "longitude", nullable = true, precision = 0)
	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	@Basic
	@Column(name = "latitude", nullable = true, precision = 0)
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		LocationEntity that = (LocationEntity) o;

		if (id != that.id) return false;
		if (query != null ? !query.equals(that.query) : that.query != null) return false;
		if (longitude != null ? !longitude.equals(that.longitude) : that.longitude != null) return false;
		if (latitude != null ? !latitude.equals(that.latitude) : that.latitude != null) return false;

		return true;
	}

}
