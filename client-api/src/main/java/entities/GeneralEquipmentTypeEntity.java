package entities;

import javax.persistence.*;

@Entity
@Table(name = "general_equipment_type", schema = "capstone_ccp", catalog = "")
public class GeneralEquipmentTypeEntity {
	private long id;
	private String name;

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
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		GeneralEquipmentTypeEntity that = (GeneralEquipmentTypeEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;

		return true;
	}

}
