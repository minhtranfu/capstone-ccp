package entities;

import listeners.entityListenters.EquipmentFeedbackEntityListener;
import listeners.entityListenters.MaterialFeedbackEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "equipment_feedback", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "EquipmentFeedbackEntity.bySupplier", query = "select e from EquipmentFeedbackEntity e where e.supplier.id = :supplierId")
@NamedEntityGraph(name = "graph.EquipmentFeedbackEntity.includeAll", includeAllAttributes = true)
@EntityListeners(EquipmentFeedbackEntityListener.class)
public class EquipmentFeedbackEntity {
	private long id;

	@Min(0)
	@Max(5)
	@NotNull
	private double rating;
	@NotNull
	private String content;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;
	@NotNull
	private ContractorEntity supplier;
	@NotNull
	private ContractorEntity requester;
	@NotNull
	private HiringTransactionEntity hiringTransaction;

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
	@Column(name = "content", nullable = true, length = 1000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Basic
	@Column(name = "created_time", nullable = false, insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = false, insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	@Basic
	@Column(name = "is_deleted", nullable = true, insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier_id")
	public ContractorEntity getSupplier() {
		return supplier;
	}

	public void setSupplier(ContractorEntity supplier) {
		this.supplier = supplier;
	}


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "requester_id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
	}

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "hiring_transaction_id")
	public HiringTransactionEntity getHiringTransaction() {
		return hiringTransaction;
	}

	public void setHiringTransaction(HiringTransactionEntity hiringTransaction) {
		this.hiringTransaction = hiringTransaction;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		EquipmentFeedbackEntity that = (EquipmentFeedbackEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
