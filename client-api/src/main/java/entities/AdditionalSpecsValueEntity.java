package entities;

import javax.persistence.*;

@Entity
@Table(name = "additional_specs_value", schema = "capstone_ccp", catalog = "")
public class AdditionalSpecsValueEntity {
	long getId;
	private long id;
	private String value;
	private Integer additionalSpecsFieldId;
	private Integer equipmentId;

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
	@Column(name = "value", nullable = true, length = 255)
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	@Basic
	@Column(name = "additional_specs_field_id", nullable = true)
	public Integer getAdditionalSpecsFieldId() {
		return additionalSpecsFieldId;
	}

	public void setAdditionalSpecsFieldId(Integer additionalSpecsFieldId) {
		this.additionalSpecsFieldId = additionalSpecsFieldId;
	}

	@Basic
	@Column(name = "equipment_id", nullable = true)
	public Integer getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(Integer equipmentId) {
		this.equipmentId = equipmentId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AdditionalSpecsValueEntity that = (AdditionalSpecsValueEntity) o;

		if (id != that.id) return false;
		if (value != null ? !value.equals(that.value) : that.value != null) return false;
		if (additionalSpecsFieldId != null ? !additionalSpecsFieldId.equals(that.additionalSpecsFieldId) : that.additionalSpecsFieldId != null)
			return false;
		if (equipmentId != null ? !equipmentId.equals(that.equipmentId) : that.equipmentId != null) return false;

		return true;
	}

}
