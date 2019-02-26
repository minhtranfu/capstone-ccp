package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "EquipmentTypeEntity.getAllEquipmentType", query = "select p from EquipmentTypeEntity p")
public class EquipmentTypeEntity {
	private long id;
	private String name;
	private GeneralEquipmentTypeEntity generalEquipment;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;
	private List<AdditionalSpecsFieldEntity> additionalSpecsFields;



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

	@ManyToOne
	@JoinColumn(name = "general_equipment_type_id")
	public GeneralEquipmentTypeEntity getGeneralEquipment() {
		return generalEquipment;
	}

	public void setGeneralEquipment(GeneralEquipmentTypeEntity generalEquipment) {
		this.generalEquipment = generalEquipment;
	}

	@OneToMany(mappedBy = "equipmentType", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
	@Where(clause = "is_deleted=0")
	public List<AdditionalSpecsFieldEntity> getAdditionalSpecsFields() {
		return additionalSpecsFields;
	}

	public void setAdditionalSpecsFields(List<AdditionalSpecsFieldEntity> additionalSpecsFieldEntities) {
		this.additionalSpecsFields = additionalSpecsFieldEntities;
	}


	@Basic
	@Column(name = "is_deleted", insertable=false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}
}
