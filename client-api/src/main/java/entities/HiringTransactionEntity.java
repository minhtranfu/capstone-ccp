package entities;


import dtos.requests.HiringTransactionRequest;
import listeners.entityListenters.HiringTransactionEntityListener;
import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "hiring_transaction", schema = "capstone_ccp")
@Where(clause = "is_deleted=0")
@NamedQueries({
		@NamedQuery(name = "HiringTransactionEntity.getTransactionBySupplierId", query = "select e from HiringTransactionEntity  e where e.equipment.contractor.id = :supplierId")
		, @NamedQuery(name = "HiringTransactionEntity.getTransactionsByRequesterId", query = "select e from HiringTransactionEntity  e where e.requester.id = :requesterId")
		,@NamedQuery(name = "HiringTransactionEntity.getRentingTimeRangeIntersectingWith", query = "select e from HiringTransactionEntity e where e.equipment.id = :equipmentId and (e.status = 'ACCEPTED' or e.status = 'PROCESSING') and not (e.beginDate > :curEndDate or e.endDate< :curBeginDate)")
		,@NamedQuery(name = "HiringTransactionEntity.getPendingTransactionIntersectingWith", query = "select e from HiringTransactionEntity e where e.equipment.id = :equipmentId and e.status = 'PENDING'  and not (e.beginDate > :curEndDate or e.endDate< :curBeginDate)")
		,@NamedQuery(name = "HiringTransactionEntity.getProcessingTransactionsByEquipmentId",query = "select e from HiringTransactionEntity  e where e.equipment.id = :equipmentId and e.status = 'PROCESSING'")
}
)
@EntityListeners(HiringTransactionEntityListener.class)
public class HiringTransactionEntity {
	private long id;
	private Status status;
	private Integer dailyPrice;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private LocalDate beginDate;
	private LocalDate endDate;

	private String cancelReason;
	private ContractorEntity canceledBy;

	private String equipmentAddress;
	private double equipmentLatitude;
	private double equipmentLongitude;

	private String requesterAddress;
	private double requesterLatitude;
	private double requesterLongitude;

	private boolean isDeleted;


	private EquipmentEntity equipment;
	private ContractorEntity requester;
	private EquipmentFeedbackEntity equipmentFeedback;


	public HiringTransactionEntity() {
	}

	public HiringTransactionEntity(HiringTransactionRequest request) {
		this.beginDate = request.getBeginDate();
		this.endDate = request.getEndDate();
		this.requesterAddress = request.getRequesterAddress();
		this.requesterLatitude = request.getRequesterLatitude();
		this.requesterLongitude = request.getRequesterLongitude();

		EquipmentEntity equipmentEntity = new EquipmentEntity();
		equipmentEntity.setId(request.getEquipmentId());
		this.equipment = equipmentEntity;

		ContractorEntity requester = new ContractorEntity();
		requester.setId(request.getRequesterId());
		this.requester = requester;

		this.dailyPrice = equipment.getDailyPrice();
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
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 45, insertable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Basic
	@Column(name = "daily_price", nullable = true)
	public Integer getDailyPrice() {
		return dailyPrice;
	}

	public void setDailyPrice(Integer dailyPrice) {
		this.dailyPrice = dailyPrice;
	}


	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "requester_id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
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
	@Column(name = "begin_date")
	public LocalDate getBeginDate() {
		return beginDate;
	}


	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date")
	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}


	@Basic
	@Column(name = "cancel_reason")
	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}


	@ManyToOne
	@JoinColumn(name = "canceled_by")
	public ContractorEntity getCanceledBy() {
		return canceledBy;
	}

	public void setCanceledBy(ContractorEntity canceledBy) {
		this.canceledBy = canceledBy;
	}

	@NotNull
	@NotBlank
	@Basic
	@Column(name = "equipment_address")
	public String getEquipmentAddress() {
		return equipmentAddress;
	}

	public void setEquipmentAddress(String equipmentAddress) {
		this.equipmentAddress = equipmentAddress;
	}

	@Basic
	@Column(name = "equipment_lat")
	@NotNull
	@Min(-90)
	@Max(90)
	public double getEquipmentLatitude() {
		return equipmentLatitude;
	}

	public void setEquipmentLatitude(double equipmentLatitude) {
		this.equipmentLatitude = equipmentLatitude;
	}

	@Basic
	@Column(name = "equipment_long")
	@NotNull
	@Min(-180)
	@Max(180)
	public double getEquipmentLongitude() {
		return equipmentLongitude;
	}

	public void setEquipmentLongitude(double equipmentLongitude) {
		this.equipmentLongitude = equipmentLongitude;
	}

	@Basic
	@NotNull
	@NotBlank
	@Column(name = "requester_address")
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}


	@Basic
	@Column(name = "requester_lat")
	@NotNull
	@Min(-90)
	@Max(90)
	public double getRequesterLatitude() {
		return requesterLatitude;
	}

	public void setRequesterLatitude(double requesterLatitude) {
		this.requesterLatitude = requesterLatitude;
	}

	@Basic
	@Column(name = "requester_long")
	@NotNull
	@Min(-180)
	@Max(180)
	public double getRequesterLongitude() {
		return requesterLongitude;
	}

	public void setRequesterLongitude(double requesterLongitude) {
		this.requesterLongitude = requesterLongitude;
	}

	@Basic
	@Column(name = "is_deleted", insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}


	@ManyToOne()
	@JoinColumn(name = "equipment_id")
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}

	@JsonbTransient
	@OneToOne(mappedBy = "hiringTransaction")
	public EquipmentFeedbackEntity getEquipmentFeedback() {
		return equipmentFeedback;
	}

	public void setEquipmentFeedback(EquipmentFeedbackEntity equipmentFeedback) {
		this.equipmentFeedback = equipmentFeedback;
	}


	@Transient
	public boolean isFeedbacked() {
		return this.getEquipmentFeedback() != null;
	}


	public enum Status {
		PENDING,
		ACCEPTED,
		PROCESSING,
		FINISHED,
		CANCELED,
		DENIED
	}
}
