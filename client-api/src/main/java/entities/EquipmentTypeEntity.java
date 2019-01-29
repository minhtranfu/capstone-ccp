package entities;

import javax.persistence.*;

@Entity
@Table(name = "equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "EquipmentTypeEntity.getAllEquipmentType", query = "select p from EquipmentTypeEntity p")
public class EquipmentTypeEntity {
	private long id;
	private String name;
	private GeneralEquipmentTypeEntity generalEquipment;
	private boolean isDeleted;

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

	@ManyToOne
	@JoinColumn(name = "general_equipment_type_id")
	public GeneralEquipmentTypeEntity getGeneralEquipment() {
		return generalEquipment;
	}

	public void setGeneralEquipment(GeneralEquipmentTypeEntity generalEquipment) {
		this.generalEquipment = generalEquipment;
	}


	@Basic
	@Column(name = "is_deleted")
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}
}
