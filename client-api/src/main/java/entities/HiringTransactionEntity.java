package entities;


import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.security.AllPermission;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "hiring_transaction", schema = "capstone_ccp", catalog = "")
@Where(clause = "is_deleted=0")
@NamedQueries({
		@NamedQuery(name = "HiringTransactionEntity.getTransactionBySupplierId", query = "select e from HiringTransactionEntity  e where e.equipment.contractor.id = :supplierId")
		, @NamedQuery(name = "HiringTransactionEntity.getTransactionsByRequesterId", query = "select e from HiringTransactionEntity  e where e.requester.id = :requesterId")
}
)
public class HiringTransactionEntity {
	private long id;
	private Status status;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private Timestamp createdTime;
	private Timestamp updatedTime;
	private Date beginDate;
	private Date endDate;

	private String equipmentAddress;
	private double equipmentLatitude;
	private double equipmentLongitude;

	private String requesterAddress;
	private double requesterLatitude;
	private double requesterLongitude;

	private boolean isDeleted;


	private EquipmentEntity equipment;
	private ContractorEntity requester;

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
	@Column(name = "status", nullable = false, length = 45)
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

	@Basic
	@Column(name = "delivery_price", nullable = true)
	public Integer getDeliveryPrice() {
		return deliveryPrice;
	}

	public void setDeliveryPrice(Integer deliveryPrice) {
		this.deliveryPrice = deliveryPrice;
	}


	@ManyToOne
	@JoinColumn(name = "requester_id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
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

	@Basic
	@Column(name = "begin_date")
	public Date getBeginDate() {
		return beginDate;
	}


	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date")
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

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
	public double getEquipmentLatitude() {
		return equipmentLatitude;
	}

	public void setEquipmentLatitude(double equipmentLatitude) {
		this.equipmentLatitude = equipmentLatitude;
	}

	@Basic
	@Column(name = "equipment_long")
	public double getEquipmentLongitude() {
		return equipmentLongitude;
	}

	public void setEquipmentLongitude(double equipmentLongitude) {
		this.equipmentLongitude = equipmentLongitude;
	}

	@Basic
	@Column(name = "requester_address")
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}


	@Basic
	@Column(name = "requester_lat")
	public double getRequesterLatitude() {
		return requesterLatitude;
	}

	public void setRequesterLatitude(double requesterLatitude) {
		this.requesterLatitude = requesterLatitude;
	}

	@Basic
	@Column(name = "requester_long")
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


	public enum Status {
		PENDING,
		ACCEPTED,
		DENIED
	}
}
