package entities;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
//@Where(clause = "is_deleted=0")
@Table(name = "debris_transaction", schema = "capstone_ccp", catalog = "")
public class DebrisTransactionEntity {
	private long id;
	private double price;

	@NotNull
	private Status status;

	private String cancelReason;

	private ContractorEntity requester;
	private ContractorEntity supplier;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private DebrisFeedbackEntity debrisFeedback;
	private DebrisPostEntity debrisPost;
	private DebrisBidEntity debrisBid;

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
	@Column(name = "price", nullable = false, precision = 0)
	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	@Basic
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = true, insertable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Basic
	@Column(name = "cancel_reason", nullable = true, length = 256)
	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}


	@ManyToOne
	@JoinColumn(name = "requester_id", referencedColumnName = "id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
	}

	@ManyToOne
	@JoinColumn(name = "supplier_id", referencedColumnName = "id")
	public ContractorEntity getSupplier() {
		return supplier;
	}

	public void setSupplier(ContractorEntity supplier) {
		this.supplier = supplier;
	}

	@Basic
	@Column(name = "created_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisTransactionEntity that = (DebrisTransactionEntity) o;
		return id == that.id;
	}

	@JsonbTransient
	@OneToOne(mappedBy = "debrisTransaction")
	public DebrisFeedbackEntity getDebrisFeedback() {
		return debrisFeedback;
	}

	public void setDebrisFeedback(DebrisFeedbackEntity debrisFeedbacksById) {
		this.debrisFeedback = debrisFeedbacksById;
	}

	@ManyToOne
	@JoinColumn(name = "debris_post_id", referencedColumnName = "id")
	public DebrisPostEntity getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(DebrisPostEntity debrisPostByDebrisPostId) {
		this.debrisPost = debrisPostByDebrisPostId;
	}

	@ManyToOne
	@JoinColumn(name = "debris_bid_id", referencedColumnName = "id")
	public DebrisBidEntity getDebrisBid() {
		return debrisBid;
	}

	public void setDebrisBid(DebrisBidEntity debrisBidByDebrisBidId) {
		this.debrisBid = debrisBidByDebrisBidId;
	}

	public enum Status{
		ACCEPTED,
		DELIVERING,
		WORKING,
		FINISHED,
		CANCELED
	}
}
