package entities;

import javax.persistence.*;

@Entity
@Table(name = "additional_specs_field", schema = "capstone_ccp", catalog = "")
public class AdditionalSpecsFieldEntity {
	long getId;
	private long id;
	private String name;
	private String dataType;
	private Integer equipmentTypeId;

	@Id @GeneratedValue
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
	@Column(name = "data_type", nullable = true, length = 255)
	public String getDataType() {
		return dataType;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	@Basic
	@Column(name = "equipment_type_id", nullable = true)
	public Integer getEquipmentTypeId() {
		return equipmentTypeId;
	}

	public void setEquipmentTypeId(Integer equipmentTypeId) {
		this.equipmentTypeId = equipmentTypeId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AdditionalSpecsFieldEntity that = (AdditionalSpecsFieldEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (dataType != null ? !dataType.equals(that.dataType) : that.dataType != null) return false;
		if (equipmentTypeId != null ? !equipmentTypeId.equals(that.equipmentTypeId) : that.equipmentTypeId != null)
			return false;

		return true;
	}


}
