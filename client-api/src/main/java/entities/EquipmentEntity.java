package entities;

import dtos.queryResults.MatchedSubscriptionResult;
import dtos.wrappers.IndependentHiringTransactionWrapper;
import listeners.entityListenters.EquipmentEntityListener;
import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbNillable;
import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.xml.bind.annotation.XmlTransient;
import java.io.Serializable;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "equipment", schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "EquipmentEntity.searchEquipment", query = "select e from EquipmentEntity  e where exists (select t from e.availableTimeRanges t where t.beginDate <= :curBeginDate and :curBeginDate <= :curEndDate  and  :curEndDate <= t.endDate)")
		, @NamedQuery(name = "EquipmentEntity.getAll", query = "select  e from EquipmentEntity e")
		, @NamedQuery(name = "EquipmentEntity.getOverdateRenting", query = "select e from EquipmentEntity  e where e.status = 'RENTING' and exists (select t from e.processingHiringTransactions t where t.endDate < current_date )")
})

@NamedNativeQuery(name = "EquipmentEntity.getMatchedEquipmentForSubscriptions", query = "select e.id as equipment_id, s.id as subscription_id, s.contractor_id from equipment e , subscription s " +
		"where e.status = 'AVAILABLE'" +
		"and e.updated_time > now()-:timeOffset\n" +
		"and \n" +
		"(s.equipment_type_id = e.equipment_type_id or s.equipment_type_id is null or s.equipment_type_id = 0)\n" +
		"and  (s.max_price > e.daily_price  or s.max_price =-1 or s.max_price is null)\n" +
		"\n" +
		"-- check distance ( require lat-long not null)\n" +
		"and (getDistance(e.id,s.id) <= max_distance )-- or max_distance is  null or max_distance = -1)\n" +
		"-- check exists equipment availble time range contain the subscribed time range\n" +
		"and   exists (select * from available_time_range t where t.equipment_id = e.id and t.begin_date <= s.begin_date  and  s.end_date <= t.end_date)\n" +
		"\n" +
		"\n" +
		"-- check equipment renting time not contain the subscribed time range \n" +
		"and not exists (select * from hiring_transaction h where h.equipment_id = e.id and (h.status = 'ACCEPTED' or h.status = 'PROCESSING') and not (h.end_date > s.end_date or h.end_date< s.begin_date))\n"
		, resultSetMapping = "MatchedSubscriptionResult"
)
@SqlResultSetMapping(
		name = "MatchedSubscriptionResult",
		classes = @ConstructorResult(
				targetClass = MatchedSubscriptionResult.class,
				columns = {
						@ColumnResult(name = "equipment_id", type = long.class),
						@ColumnResult(name = "subscription_id", type = long.class),
						@ColumnResult(name = "contractor_id", type = long.class)
				}
		)
)
@EntityListeners(EquipmentEntityListener.class)
//for serializing null values ( not hide it)
@JsonbNillable
public class EquipmentEntity {
	private long id;
	@NotNull
	@NotEmpty
	private String name;

	@NotNull
	private Integer dailyPrice;
	private String description;
	private Status status;
	private EquipmentImageEntity thumbnailImage;

	private boolean isDeleted;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;


	private EquipmentTypeEntity equipmentType;

	private ContractorEntity contractor;
	private ConstructionEntity construction;

	private List<AvailableTimeRangeEntity> availableTimeRanges;
	private Collection<EquipmentImageEntity> equipmentImages;


	private List<AdditionalSpecsValueEntity> additionalSpecsValues;
	private List<HiringTransactionEntity> hiringTransactions;

	private List<HiringTransactionEntity> processingHiringTransactions;
	private List<HiringTransactionEntity> activeHiringTransactionEntities;

	public EquipmentEntity() {
		availableTimeRanges = new ArrayList<>();
		equipmentImages = new ArrayList<>();
		additionalSpecsValues = new ArrayList<>();
		hiringTransactions = new ArrayList<>();
		processingHiringTransactions = new ArrayList<>();
		activeHiringTransactionEntities = new ArrayList<>();
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

	// TODO: 2/27/19 orphan removal here !
	@OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
	public List<AvailableTimeRangeEntity> getAvailableTimeRanges() {
		return availableTimeRanges;
	}

	public void setAvailableTimeRanges(List<AvailableTimeRangeEntity> availableTimeRanges) {
		this.availableTimeRanges = availableTimeRanges;
	}

	public void addAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		if (availableTimeRanges == null) {
			return;
		}
		this.availableTimeRanges.add(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(this);
	}

	public void deleteAvailableTimeRange(AvailableTimeRangeEntity availableTimeRangeEntity) {
		if (availableTimeRanges == null) {
			return;
		}
		this.availableTimeRanges.remove(availableTimeRangeEntity);
		availableTimeRangeEntity.setEquipment(null);
	}


	public void deleteAllAvailableTimeRange() {
		if (availableTimeRanges == null) {
			return;
		}
		for (AvailableTimeRangeEntity availableTimeRange : availableTimeRanges) {
			availableTimeRange.setEquipment(null);
		}
		this.availableTimeRanges.clear();
	}


	@OneToOne(cascade = {})
	@JoinColumn(name = "thumbnail_image_id")
	public EquipmentImageEntity getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(EquipmentImageEntity thumbnailImage) {
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


	@JsonbTransient
	@Transient
	public String getFinalAddress() {
		return this.getConstruction().getAddress();
	}

	@JsonbTransient
	@Transient
	public Double getFinalLongitude() {
		return this.getConstruction().getLongitude();
	}

	@JsonbTransient
	@Transient
	public Double getFinalLatitude() {
		return this.getConstruction().getLatitude();
	}


	@OneToMany(mappedBy = "equipment", orphanRemoval = false)
	public Collection<EquipmentImageEntity> getEquipmentImages() {
		return equipmentImages;
	}

	public void setEquipmentImages(Collection<EquipmentImageEntity> equipmentImages) {
		this.equipmentImages = equipmentImages;
	}

	public void addEquipmentImage(EquipmentImageEntity equipmentImageEntity) {
		this.equipmentImages.add(equipmentImageEntity);
		equipmentImageEntity.setEquipment(this);
	}

	public void removeEquipmentImage(EquipmentImageEntity equipmentImageEntity) {
		this.equipmentImages.remove(equipmentImageEntity);
		equipmentImageEntity.setEquipment(null);
	}

	public void deleteAllEquipmentImage() {

		for (EquipmentImageEntity equipmentImage : equipmentImages) {
			equipmentImage.setEquipment(null);
		}
		this.equipmentImages.clear();

	}


	// TODO: 2/27/19 orphan removal here !

	@OneToMany(mappedBy = "equipment", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = false)
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
	@OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
	@Where(clause = "status = 'PROCESSING' and is_deleted=0")
	public List<HiringTransactionEntity> getProcessingHiringTransactions() {
		return processingHiringTransactions;
	}

	public void setProcessingHiringTransactions(List<HiringTransactionEntity> processingHiringTransactions) {
		this.processingHiringTransactions = processingHiringTransactions;
	}

	@Transient
	public IndependentHiringTransactionWrapper getProcessingHiringTransaction() {
		if (getProcessingHiringTransactions() != null && getProcessingHiringTransactions().size() > 0) {
			return new IndependentHiringTransactionWrapper(getProcessingHiringTransactions().get(0));
		} else {
			return null;
		}
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "equipment", fetch = FetchType.LAZY)
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
		if (getActiveHiringTransactionEntities() != null) {

			for (HiringTransactionEntity activeHiringTransactionEntity : getActiveHiringTransactionEntities()) {
				result.add(new IndependentHiringTransactionWrapper(activeHiringTransactionEntity));
			}
		}
		return result;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		EquipmentEntity that = (EquipmentEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}


	public enum Status {
		AVAILABLE,
		DELIVERING,
		RENTING,
		WAITING_FOR_RETURNING
	}
}
