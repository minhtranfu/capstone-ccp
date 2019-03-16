package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "material_type", schema = "capstone_ccp")
@NamedQuery(name = "MaterialTypeEntity.findAll", query = "select e from MaterialTypeEntity e ")
public class MaterialTypeEntity {
	private long id;
	private String name;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	private GeneralMaterialTypeEntity generalMaterialType;
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
	@Column(name = "name", nullable = false, length = 256)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "created_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	@Basic
	@Column(name = "is_deleted", nullable = true)

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}



	@ManyToOne
	@JoinColumn(name = "general_material_type_id")
	@JsonbTransient
	public GeneralMaterialTypeEntity getGeneralMaterialType() {
		return generalMaterialType;
	}

	public void setGeneralMaterialType(GeneralMaterialTypeEntity generalMaterialType) {
		this.generalMaterialType = generalMaterialType;
	}
}
