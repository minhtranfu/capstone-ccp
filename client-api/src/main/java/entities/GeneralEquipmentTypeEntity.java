package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.xml.bind.annotation.XmlTransient;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "general_equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "GeneralEquipmentTypeEntity.getAllGeneralEquipmentType",query = "select e from GeneralEquipmentTypeEntity e")
public class GeneralEquipmentTypeEntity {
	private long id;
	private String name;
	private boolean isDeleted;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private List<EquipmentTypeEntity> equipmentTypeEntities;

	public GeneralEquipmentTypeEntity() {
	}

	public GeneralEquipmentTypeEntity(GeneralEquipmentTypeEntity generalEquipmentTypeEntity) {
		this.id = generalEquipmentTypeEntity.id;
		this.name = generalEquipmentTypeEntity.name;
		this.isDeleted = generalEquipmentTypeEntity.isDeleted;
		this.createdTime = generalEquipmentTypeEntity.createdTime;
		this.updatedTime = generalEquipmentTypeEntity.updatedTime;
		this.equipmentTypeEntities = new ArrayList<>(generalEquipmentTypeEntity.equipmentTypeEntities);
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
	@Column(name = "is_deleted", insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}


	@Basic
	@Column(name = "created_time", insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}


	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "generalEquipment", orphanRemoval = true, fetch = FetchType.EAGER)
	@Where(clause = "is_deleted=0")
	public List<EquipmentTypeEntity> getEquipmentTypeEntities() {
		return equipmentTypeEntities;
	}

	public void setEquipmentTypeEntities(List<EquipmentTypeEntity> equipmentTypeEntity) {
		this.equipmentTypeEntities = equipmentTypeEntity;
	}
}



