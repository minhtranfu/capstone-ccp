package entities;


import dtos.requests.HiringTransactionRequest;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;
import java.time.LocalDateTime;


@Entity
@Table(name = "cart_request", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "CartRequestEntity.getByContractorId", query = "select e from CartRequestEntity e where e.sent = false and  e.contractor.id = :contractorId")
@NamedStoredProcedureQuery(
		name = "CartRequestEntity.transferFromCartToTransaction"
		, procedureName = "transfer_from_cart_to_transaction"
		, parameters = {
		@StoredProcedureParameter(mode = ParameterMode.IN, type = Long.class, name = "$requester_id")
})
public class CartRequestEntity {
	private long id;
	@NotNull
	private LocalDate beginDate;
	@NotNull
	private LocalDate endDate;
	@NotNull
	@NotEmpty
	private String requesterAddress;

	@NotNull
	@Positive
	private Double requesterLong;
	@NotNull
	@Positive
	private Double requesterLat;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	@NotNull
	private EquipmentEntity equipment;

	private ContractorEntity contractor;

	private boolean isSent;


	public CartRequestEntity() {
	}

	// TODO: 3/3/19 model mapper here
	public CartRequestEntity(HiringTransactionRequest hiringTransactionRequest) {
		beginDate = hiringTransactionRequest.getBeginDate();
		endDate = hiringTransactionRequest.getEndDate();
		requesterAddress = hiringTransactionRequest.getRequesterAddress();
		requesterLong = hiringTransactionRequest.getRequesterLongitude();

		requesterLat = hiringTransactionRequest.getRequesterLatitude();

		EquipmentEntity equipment = new EquipmentEntity();
		equipment.setId(hiringTransactionRequest.getEquipmentId());

		this.equipment = equipment;


		ContractorEntity contractorEntity = new ContractorEntity();
		contractorEntity.setId(hiringTransactionRequest.getRequesterId());

		this.contractor = contractorEntity;
		isSent = false;
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
