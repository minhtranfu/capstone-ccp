package entities;

import javax.persistence.*;

@Entity
@Table(name = "additional_specs_field", schema = "capstone_ccp", catalog = "")
public class AdditionalSpecsFieldEntity {
	private long id;
	private String name;
	private String dataType;
	private EquipmentTypeEntity equipmentType;
	private boolean isDeleted;




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


	@ManyToOne
	@JoinColumn(name = "equipment_type_id")
	public EquipmentTypeEntity getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(EquipmentTypeEntity equipmentType) {
		this.equipmentType = equipmentType;
	}

	@Basic
	@Column(name = "is_deleted", insertable = false, updatable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AdditionalSpecsFieldEntity that = (AdditionalSpecsFieldEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (dataType != null ? !dataType.equals(that.dataType) : that.dataType != null) return false;
		if (equipmentType != null ? !equipmentType.equals(that.equipmentType) : that.equipmentType != null)
			return false;

		return true;
	}


}
