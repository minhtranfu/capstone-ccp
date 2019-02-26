package entities;

import dtos.wrappers.IndependentHiringTransactionWrapper;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "equipment", schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "EquipmentEntity.searchEquipment", query = "select e from EquipmentEntity  e where exists (select t from e.availableTimeRanges t where t.beginDate <= :curBeginDate and :curBeginDate <= :curEndDate  and  :curEndDate <= t.endDate)")
		, @NamedQuery(name = "EquipmentEntity.getAll", query = "select  e from EquipmentEntity e")
})

public class EquipmentEntity implements Serializable {
	private long id;
	private String name;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private String description;
	private Status status;
	private String thumbnailImage;

	private boolean isDeleted;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;


	private String address;
	private Double latitude;
	private Double longitude;

	private EquipmentTypeEntity equipmentType;

	private ContractorEntity contractor;
	private ConstructionEntity  construction;

	private List<AvailableTimeRangeEntity> availableTimeRanges;
	private Collection<DescriptionImageEntity> descriptionImages;


	private List<AdditionalSpecsValueEntity> additionalSpecsValues;
	private List<HiringTransactionEntity> hiringTransactions;

	private List<HiringTransactionEntity> processingHiringTransactions;
	private List<HiringTransactionEntity> activeHiringTransactionEntities;

	public EquipmentEntity() {
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
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = true, length = 45, insertable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
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
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity constructor) {
		this.contractor = constructor;
	}

	@ManyToOne
	@JoinColumn(name = "construction_id")
	public ConstructionEntity getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionEntity construction) {
		this.construction = construction;
	}

	@OneToMany(mappedBy = "equipment",cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	public List<AvailableTimeRangeEntity> getAvailableTimeRanges() {
		return availableTimeRanges;
	}

	public void setAvailableTimeRanges(List<AvailableTimeRangeEntity> availableTimeRanges) {
		this.availableTimeRanges = availableTimeRanges;
	}

	public void addAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		this.availableTimeRanges.add(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(this);
	}

	public void deleteAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		this.availableTimeRanges.remove(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(null);
	}


	public void deleteAllAvailableTimeRange() {
		for (AvailableTimeRangeEntity availableTimeRange : availableTimeRanges) {
			availableTimeRange.setEquipment(null);
		}
		this.availableTimeRanges.clear();
	}


	@Basic
	@Column(name = "thumbnail_image")
	public String getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(String thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
	}

	@Basic
	@Column(name = "is_deleted", insertable = false, nullable = false)
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

	@Basic
	@Column(name = "address")
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Basic
	@Column(name = "lat")
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@Basic
	@Column(name = "`long`")
	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}

	@OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@Where(clause = "is_deleted=0")

	public Collection<DescriptionImageEntity> getDescriptionImages() {
		return descriptionImages;
	}

	public void setDescriptionImages(Collection<DescriptionImageEntity> descriptionImagesById) {
		this.descriptionImages = descriptionImagesById;
	}


	@OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
	@Where(clause = "is_deleted=0")

	public List<AdditionalSpecsValueEntity> getAdditionalSpecsValues() {
		return additionalSpecsValues;
	}

	public void setAdditionalSpecsValues(List<AdditionalSpecsValueEntity> additionalSpecsValueEntities) {
		this.additionalSpecsValues = additionalSpecsValueEntities;
	}

	public void addAdditionalSpecsValue(AdditionalSpecsValueEntity additionalSpecsValueEntity) {
		additionalSpecsValueEntity.setEquipment(this);
		additionalSpecsValues.add(additionalSpecsValueEntity);
	}

	public void removeAdditionalSpecsValue(AdditionalSpecsValueEntity additionalSpecsValueEntity) {
		additionalSpecsValueEntity.setEquipment(null);
		additionalSpecsValues.remove(additionalSpecsValueEntity);
	}



	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
	@Where(clause = "is_deleted=0")
	public List<HiringTransactionEntity> getHiringTransactions() {
		return hiringTransactions;
	}

	public void setHiringTransactions(List<HiringTransactionEntity> hiringTransactions) {
		this.hiringTransactions = hiringTransactions;
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "equipment",fetch = FetchType.LAZY)
	@Where(clause = "status = 'PROCESSING' and is_deleted=0")
	public List<HiringTransactionEntity> getProcessingHiringTransactions() {
		return processingHiringTransactions;
	}

	public void setProcessingHiringTransactions(List<HiringTransactionEntity> processingHiringTransactions) {
		this.processingHiringTransactions = processingHiringTransactions;
	}

	@Transient
	public IndependentHiringTransactionWrapper getProcessingHiringTransaction() {
		if (getProcessingHiringTransactions().size() > 0) {
			return new IndependentHiringTransactionWrapper(getProcessingHiringTransactions().get(0));
		} else {
			return null;
		}
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "equipment",fetch = FetchType.LAZY)
	@Where(clause = "(status = 'PROCESSING' or status='ACCEPTED') and is_deleted=0")
	public List<HiringTransactionEntity> getActiveHiringTransactionEntities() {
		return activeHiringTransactionEntities;
	}

	public void setActiveHiringTransactionEntities(List<HiringTransactionEntity> activeHiringTransactionEntities) {
		this.activeHiringTransactionEntities = activeHiringTransactionEntities;
	}

	@Transient
	public List<IndependentHiringTransactionWrapper> getActiveHiringTransactions() {
		ArrayList<IndependentHiringTransactionWrapper> result = new ArrayList<>();
		for (HiringTransactionEntity activeHiringTransactionEntity : getActiveHiringTransactionEntities()) {
			result.add(new IndependentHiringTransactionWrapper(activeHiringTransactionEntity));
		}
		return result;
	}

	public enum Status {
		AVAILABLE,
		DELIVERING,
		RENTING,
		WAITING_FOR_RETURNING
	}
}
