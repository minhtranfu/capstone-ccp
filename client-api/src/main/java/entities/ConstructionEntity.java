package entities;

import javax.persistence.*;

@Entity
@Table(name = "construction", schema = "capstone_ccp", catalog = "")
public class ConstructionEntity {
	private long id;
	private String name;
	private Integer locationId;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "location_id", nullable = true)
	public Integer getLocationId() {
		return locationId;
	}

	public void setLocationId(Integer locationId) {
		this.locationId = locationId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		ConstructionEntity that = (ConstructionEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (locationId != null ? !locationId.equals(that.locationId) : that.locationId != null) return false;

		return true;
	}

}
