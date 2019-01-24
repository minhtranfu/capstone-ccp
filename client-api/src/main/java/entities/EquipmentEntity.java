package entities;

import javax.persistence.*;
import java.util.Collection;

@Entity
@Table(name = "equipment", schema = "capstone_ccp")
public class EquipmentEntity {
	private long id;
	private String name;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private String description;
	private String status;
	private Integer equipmentTypeId;
	private Integer constructorId;
	private Integer constructionId;
	private Integer locationId;
	private Collection<DescriptionImageEntity> descriptionImagesById;

	@Id
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
	@Column(name = "daily_price", nullable = true)
	public Integer getDailyPrice() {
		return dailyPrice;
	}

	public void setDailyPrice(Integer dailyPrice) {
		this.dailyPrice = dailyPrice;
	}

	@Basic
	@Column(name = "delivery_price", nullable = true)
	public Integer getDeliveryPrice() {
		return deliveryPrice;
	}

	public void setDeliveryPrice(Integer deliveryPrice) {
		this.deliveryPrice = deliveryPrice;
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
	@Column(name = "status", nullable = true, length = 45)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Basic
	@Column(name = "equipment_type_id", nullable = true)
	public Integer getEquipmentTypeId() {
		return equipmentTypeId;
	}

	public void setEquipmentTypeId(Integer equipmentTypeId) {
		this.equipmentTypeId = equipmentTypeId;
	}

	@Basic
	@Column(name = "constructor_id", nullable = true)
	public Integer getConstructorId() {
		return constructorId;
	}

	public void setConstructorId(Integer constructorId) {
		this.constructorId = constructorId;
	}

	@Basic
	@Column(name = "construction_id", nullable = true)
	public Integer getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Integer constructionId) {
		this.constructionId = constructionId;
	}

	@Basic
	@Column(name = "location_id", nullable = true)
	public Integer getLocationId() {
		return locationId;
	}

	public void setLocationId(Integer locationId) {
		this.locationId = locationId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		EquipmentEntity that = (EquipmentEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (dailyPrice != null ? !dailyPrice.equals(that.dailyPrice) : that.dailyPrice != null) return false;
		if (deliveryPrice != null ? !deliveryPrice.equals(that.deliveryPrice) : that.deliveryPrice != null)
			return false;
		if (description != null ? !description.equals(that.description) : that.description != null) return false;
		if (status != null ? !status.equals(that.status) : that.status != null) return false;
		if (equipmentTypeId != null ? !equipmentTypeId.equals(that.equipmentTypeId) : that.equipmentTypeId != null)
			return false;
		if (constructorId != null ? !constructorId.equals(that.constructorId) : that.constructorId != null)
			return false;
		if (constructionId != null ? !constructionId.equals(that.constructionId) : that.constructionId != null)
			return false;
		if (locationId != null ? !locationId.equals(that.locationId) : that.locationId != null) return false;

		return true;
	}


	@OneToMany(mappedBy = "equipmentByEquipmentId")
	public Collection<DescriptionImageEntity> getDescriptionImagesById() {
		return descriptionImagesById;
	}

	public void setDescriptionImagesById(Collection<DescriptionImageEntity> descriptionImagesById) {
		this.descriptionImagesById = descriptionImagesById;
	}
}
