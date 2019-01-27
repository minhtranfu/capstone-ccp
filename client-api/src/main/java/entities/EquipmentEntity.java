package entities;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "equipment", schema = "capstone_ccp")

@NamedQueries({
		@NamedQuery(name = "EquipmentEntity.searchEquipment", query = "select e from EquipmentEntity  e where exists (select t from e.availableTimeRanges t where t.beginDate <= :curBeginDate and :curBeginDate <= :curEndDate  and  :curEndDate <= t.endDate)"),
		@NamedQuery(name = "EquipmentEntity.getAll",query = "select  e from EquipmentEntity e")
})

public class EquipmentEntity {
	private long id;
	private String name;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private String description;
	private String status;
	private EquipmentTypeEntity equipmentType;

	private ConstructorEntity constructor;
	private Integer constructionId;
	private LocationEntity location;

	private List<AvailableTimeRangeEntity> availableTimeRanges;
	private Collection<DescriptionImageEntity> descriptionImages;


	public EquipmentEntity() {
	}

	public EquipmentEntity(long id, String name, Integer dailyPrice, Integer deliveryPrice, String description, String status, EquipmentTypeEntity equipmentType, ConstructorEntity constructor, Integer constructionId, LocationEntity location, List<AvailableTimeRangeEntity> availableTimeRanges, Collection<DescriptionImageEntity> descriptionImages) {
		this.id = id;
		this.name = name;
		this.dailyPrice = dailyPrice;
		this.deliveryPrice = deliveryPrice;
		this.description = description;
		this.status = status;
		this.equipmentType = equipmentType;
		this.constructor = constructor;
		this.constructionId = constructionId;
		this.location = location;
		this.availableTimeRanges = availableTimeRanges;
		this.descriptionImages = descriptionImages;
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

	@ManyToOne
	@JoinColumn(name = "equipment_type_id")
	public EquipmentTypeEntity getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(EquipmentTypeEntity equipmentType) {
		this.equipmentType = equipmentType;
	}


	@ManyToOne()
	@JoinColumn(name = "constructor_id", insertable = false, updatable = false)
	public ConstructorEntity getConstructor() {
		return constructor;
	}

	public void setConstructor(ConstructorEntity constructor) {
		this.constructor = constructor;
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
	@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "location_id")
	public LocationEntity getLocation() {
		return location;
	}

	public void setLocation(LocationEntity locationById) {
		this.location = locationById;
	}


	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "equipment_id")
	public List<AvailableTimeRangeEntity> getAvailableTimeRanges() {
		return availableTimeRanges;
	}

	public void setAvailableTimeRanges(List<AvailableTimeRangeEntity> availableTimeRanges) {
		this.availableTimeRanges = availableTimeRanges;
	}

	@OneToMany(mappedBy = "equipmentByEquipmentId")
	public Collection<DescriptionImageEntity> getDescriptionImages() {
		return descriptionImages;
	}

	public void setDescriptionImages(Collection<DescriptionImageEntity> descriptionImagesById) {
		this.descriptionImages = descriptionImagesById;
	}
}
