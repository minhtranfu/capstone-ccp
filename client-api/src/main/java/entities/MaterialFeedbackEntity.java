package entities;

import listeners.entityListenters.MaterialFeedbackEntityListener;
import net.jcip.annotations.NotThreadSafe;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "material_feedback", schema = "capstone_ccp")
@NamedQuery(name = "MaterialFeedbackEntity.bySupplier", query = "select e from MaterialFeedbackEntity e where e.supplier.id = :supplierId")
@EntityListeners(MaterialFeedbackEntityListener.class)
public class MaterialFeedbackEntity {
	private long id;
	@NotNull
	@PositiveOrZero
	@Min(0)
	@Max(5)
	private double rating;

	private String content;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	@NotNull
	private ContractorEntity requester;
	@NotNull
	private ContractorEntity supplier;
	@NotNull
	private MaterialTransactionDetailEntity materialTransactionDetail;

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

	@ManyToOne
	@JoinColumn(name = "requester_id")
	public ContractorEntity getRequester() {
		return requester;
	}


	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
	}

	@ManyToOne
	@JoinColumn(name = "supplier_id")
	public ContractorEntity getSupplier() {
		return supplier;
	}

	public void setSupplier(ContractorEntity supplier) {
		this.supplier = supplier;
	}

	@OneToOne
	@JoinColumn(name = "material_transaction_detail_id")
	public MaterialTransactionDetailEntity getMaterialTransactionDetail() {
		return materialTransactionDetail;
	}

	public void setMaterialTransactionDetail(MaterialTransactionDetailEntity materialTransactionDetail) {
		this.materialTransactionDetail = materialTransactionDetail;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		MaterialFeedbackEntity that = (MaterialFeedbackEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
