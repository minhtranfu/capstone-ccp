package entities;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "general_equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "GeneralEquipmentTypeEntity.getAllGeneralEquipmentType",query = "select e from GeneralEquipmentTypeEntity e")
public class GeneralEquipmentTypeEntity {
	private long id;
	private String name;
	private boolean isDeleted;

	private List<EquipmentTypeEntity> equipmentTypeEntities;

	public GeneralEquipmentTypeEntity() {
	}

	public GeneralEquipmentTypeEntity(GeneralEquipmentTypeEntity equipmentTypeEntity) {
		this.id = equipmentTypeEntity.id;
		this.name = equipmentTypeEntity.name;
		this.isDeleted = equipmentTypeEntity.isDeleted;
		this.equipmentTypeEntities = new ArrayList<>(equipmentTypeEntity.equipmentTypeEntities);
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
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "is_deleted", insertable=false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@XmlTransient
	@OneToMany(mappedBy = "generalEquipment")
	public List<EquipmentTypeEntity> getEquipmentTypeEntities() {
		return equipmentTypeEntities;
	}

	public void setEquipmentTypeEntities(List<EquipmentTypeEntity> equipmentTypeEntity) {
		this.equipmentTypeEntities = equipmentTypeEntity;
	}
}
