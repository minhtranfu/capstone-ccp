package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "transaction_date_change_request", schema = "capstone_ccp")
@Where(clause = "is_deleted = 0")
@NamedQueries({
		@NamedQuery(name = "TransactionDateChangeRequestEntity.countExistingPendingRequest", query = "select count(e) from TransactionDateChangeRequestEntity e where e.hiringTransactionEntity.id=:transactionId and e.status='PENDING'")
		, @NamedQuery(name = "TransactionDateChangeRequestEntity.getRequestsByTransactionId", query = "select e from TransactionDateChangeRequestEntity e where e.hiringTransactionEntity.id=:transactionId")
		, @NamedQuery(name = "TransactionDateChangeRequestEntity.getPendingRequestByTransactionId", query = "select e from TransactionDateChangeRequestEntity e where e.hiringTransactionEntity.id=:transactionId and e.status='PENDING'")
})
public class TransactionDateChangeRequestEntity {
	private long id;
	private LocalDate requestedBeginDate;
	private LocalDate requestedEndDate;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private Status status;
	private boolean isDeleted;
	private HiringTransactionEntity hiringTransactionEntity;

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
	@Column(name = "requested_begin_date", nullable = true)
	public LocalDate getRequestedBeginDate() {
		return requestedBeginDate;
	}

	public void setRequestedBeginDate(LocalDate requestedBeginDate) {
		this.requestedBeginDate = requestedBeginDate;
	}

	@Basic
	@Column(name = "requested_end_date", nullable = true)
	public LocalDate getRequestedEndDate() {
		return requestedEndDate;
	}

	public void setRequestedEndDate(LocalDate requestedEndDate) {
		this.requestedEndDate = requestedEndDate;
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
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 255, insertable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Basic
	@Column(name = "is_deleted", insertable = false)
	public boolean getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	@OneToOne
	@JoinColumn(name = "transaction_id", nullable = true)
	public HiringTransactionEntity getHiringTransactionEntity() {
		return hiringTransactionEntity;
	}

	public void setHiringTransactionEntity(HiringTransactionEntity hiringTransactionEntity) {
		this.hiringTransactionEntity = hiringTransactionEntity;
	}


	public enum Status {
		PENDING,
		ACCEPTED,
		DENIED
	}
}
