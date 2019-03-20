package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
//@Where(clause = "is_deleted = 0")
@Table(name = "debris_feedback", schema = "capstone_ccp", catalog = "")
public class DebrisFeedbackEntity {
	private long id;

	@NotNull
	private double rating;
	private String content;
	private ContractorEntity requester;
	private ContractorEntity supplier;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	@NotNull
	private DebrisTransactionEntity debrisTransaction;

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
	@Column(name = "rating", nullable = false, precision = 0)
	public double getRating() {
		return rating;
	}

	public void setRating(double rating) {
		this.rating = rating;
	}

	@Basic
	@Column(name = "content", nullable = true, length = 10000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@ManyToOne
	@JoinColumn(name = "requester_id", nullable = false)
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof DebrisFeedbackEntity)) return false;
		DebrisFeedbackEntity that = (DebrisFeedbackEntity) o;
		return id == that.id;
	}


	@ManyToOne
	@JoinColumn(name = "supplier_id", nullable = false)
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


	@OneToOne
	@JoinColumn(name = "debris_transaction_id", referencedColumnName = "id", nullable = false)
	public DebrisTransactionEntity getDebrisTransaction() {
		return debrisTransaction;
	}

	public void setDebrisTransaction(DebrisTransactionEntity debrisTransactionByDebrisTransactionId) {
		this.debrisTransaction = debrisTransactionByDebrisTransactionId;
	}
}
