package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;

@Entity
@Table(name = "transaction_date_change_request", schema = "capstone_ccp", catalog = "")
@Where(clause = "is_deleted = 0")
@NamedQueries({
		@NamedQuery(name = "TransactionDateChangeRequestEntity.countExistingRequest", query = "select count(e) from TransactionDateChangeRequestEntity e where e.hiringTransactionEntity.id=:transactionId and e.status='PENDING'")
		, @NamedQuery(name = "TransactionDateChangeRequestEntity.getRequestsByTransactionId", query = "select e from TransactionDateChangeRequestEntity e where e.hiringTransactionEntity.id=:transactionId")
})
public class TransactionDateChangeRequestEntity {
	private long id;
	private Date requestedBeginDate;
	private Date requestedEndDate;
	private Timestamp createdTime;
	private Timestamp updatedTime;
	private Status status;
	private Byte isDeleted;
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
	public Date getRequestedBeginDate() {
		return requestedBeginDate;
	}

	public void setRequestedBeginDate(Date requestedBeginDate) {
		this.requestedBeginDate = requestedBeginDate;
	}

	@Basic
	@Column(name = "requested_end_date", nullable = true)
	public Date getRequestedEndDate() {
		return requestedEndDate;
	}

	public void setRequestedEndDate(Date requestedEndDate) {
		this.requestedEndDate = requestedEndDate;
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
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false, length = 255)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Basic
	@Column(name = "is_deleted", insertable = false)
	public Byte getIsDeleted() {
		return isDeleted;
	}

	public void setIsDeleted(Byte isDeleted) {
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
