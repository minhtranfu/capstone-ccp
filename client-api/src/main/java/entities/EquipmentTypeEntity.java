package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "equipment_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "EquipmentTypeEntity.getAllEquipmentType", query = "select p from EquipmentTypeEntity p")
public class EquipmentTypeEntity {
	private long id;
	private String name;
	private GeneralEquipmentTypeEntity generalEquipment;

	private Timestamp createdTime;
	private Timestamp updatedTime;
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
	public Timestamp getCreatedTime() {
		return createdTime;
	}


	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", insertable = false, updatable = false)
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
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

	@OneToMany(mappedBy = "equipmentType", cascade = CascadeType.ALL)
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
