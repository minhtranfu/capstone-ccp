package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "material", schema = "capstone_ccp", catalog = "")
public class MaterialEntity {
	private long id;
	private double price;
	private String thumbnailImageUrl;
	private String unit;
	private String manufacturer;
	private String description;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	private MaterialTypeEntity materialType;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "price", nullable = false, precision = 0)
	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	@Basic
	@Column(name = "unit", nullable = true, length = 256)
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Basic
	@Column(name = "manufacturer", nullable = true, length = 256)
	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	@Basic
	@Column(name = "description", nullable = true, length = -1)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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
	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}


	public void setThumbnailImageUrl(String thumbnailImageUrl) {
		this.thumbnailImageUrl = thumbnailImageUrl;
	}

	@ManyToOne
	@JoinColumn(name = "material_type_id")
	public MaterialTypeEntity getMaterialType() {
		return materialType;
	}

	public void setMaterialType(MaterialTypeEntity materialType) {
		this.materialType = materialType;
	}
}
