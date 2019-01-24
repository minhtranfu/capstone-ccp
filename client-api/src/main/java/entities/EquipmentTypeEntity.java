package entities;

import javax.persistence.*;

@Entity
@Table(name = "equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "EquipmentTypeEntity.getAllEquipmentType", query = "select p from EquipmentTypeEntity p")
public class EquipmentTypeEntity {
	private long id;
	private String name;
	private Integer generalEquipmentTypeId;

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

	@Basic
	@Column(name = "general_equipment_type_id", nullable = true)
	public Integer getGeneralEquipmentTypeId() {
		return generalEquipmentTypeId;
	}

	public void setGeneralEquipmentTypeId(Integer generalEquipmentTypeId) {
		this.generalEquipmentTypeId = generalEquipmentTypeId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		EquipmentTypeEntity that = (EquipmentTypeEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (generalEquipmentTypeId != null ? !generalEquipmentTypeId.equals(that.generalEquipmentTypeId) : that.generalEquipmentTypeId != null)
			return false;

		return true;
	}

}
