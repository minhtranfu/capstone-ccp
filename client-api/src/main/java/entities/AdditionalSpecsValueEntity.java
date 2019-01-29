package entities;

import javax.persistence.*;

@Entity
@Table(name = "additional_specs_value", schema = "capstone_ccp", catalog = "")
public class AdditionalSpecsValueEntity {
	private long id;
	private String value;
	private AdditionalSpecsFieldEntity additionalSpecsField;
	private EquipmentEntity equipment;

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


	@ManyToOne
	@JoinColumn(name = "additional_specs_field_id")
	public AdditionalSpecsFieldEntity getAdditionalSpecsField() {
		return additionalSpecsField;
	}

	public void setAdditionalSpecsField(AdditionalSpecsFieldEntity additionalSpecsField) {
		this.additionalSpecsField = additionalSpecsField;
	}

	@ManyToOne
	@JoinColumn(name = "equipment_id")
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}
}
