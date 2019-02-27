package entities;


import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "cart_request", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "CartRequestEntity.getByContractorId", query = "select e from CartRequestEntity e where e.sent = false and  e.contractor.id = :contractorId")
public class CartRequestEntity {
	private long id;
	private LocalDate beginDate;
	private LocalDate endDate;
	private String requesterAddress;
	private Double requesterLong;
	private Double requesterLat;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private EquipmentEntity equipment;
	private ContractorEntity contractor;

	private boolean isSent;


	// TODO: 2/27/19 fixing generation strategy for hibernte not found hibernate_sequence
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
	@Column(name = "begin_date", nullable = true)
	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date", nullable = true)
	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	@Basic
	@Column(name = "requester_address", nullable = true, length = 255)
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	@Basic
	@Column(name = "requester_long", nullable = true, precision = 0)
	public Double getRequesterLong() {
		return requesterLong;
	}

	public void setRequesterLong(Double requesterLong) {
		this.requesterLong = requesterLong;
	}

	@Basic
	@Column(name = "requester_lat", nullable = true, precision = 0)
	public Double getRequesterLat() {
		return requesterLat;
	}

	public void setRequesterLat(Double requesterLat) {
		this.requesterLat = requesterLat;
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

	@ManyToOne
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}

	@ManyToOne
	@JoinColumn(name = "equipment_id")
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}

	@Basic
	@Column(name = "is_sent")
	public boolean isSent() {
		return isSent;
	}

	public void setSent(boolean sent) {
		isSent = sent;
	}

}
