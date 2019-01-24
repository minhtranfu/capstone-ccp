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
	private LocationEntity location;
	private Collection<DescriptionImageEntity> descriptionImages;

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

	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "location_id")

	public LocationEntity getLocation() {
		return location;
	}

	public void setLocation(LocationEntity locationById) {
		this.location = locationById;
	}



	@OneToMany(mappedBy = "equipmentByEquipmentId")
	public Collection<DescriptionImageEntity> getDescriptionImages() {
		return descriptionImages;
	}

	public void setDescriptionImages(Collection<DescriptionImageEntity> descriptionImagesById) {
		this.descriptionImages = descriptionImagesById;
	}
}
