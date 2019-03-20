package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Where(clause = "is_deleted = 0")
@Table(name = "debris_bid", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "DebrisBidEntity.bySupplier", query = "select e from DebrisBidEntity e where e.supplier.id = :supplierId")
public class DebrisBidEntity {

	private long id;

	private double price;
	private Status status;

	private String description;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private boolean isDeleted;

	@NotNull
	private ContractorEntity supplier;
	@NotNull
	private DebrisPostEntity debrisPost;
	private List<DebrisTransactionEntity> debrisTransactions;

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



	@Basic
	@Column(name = "is_deleted")
	public boolean isDeleted() {
		return isDeleted;
	}
	public void setDeleted(boolean isDeleted) {
		this.isDeleted = isDeleted;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof DebrisBidEntity)) return false;
		DebrisBidEntity that = (DebrisBidEntity) o;
		return id == that.id;
	}

	@ManyToOne
	@JoinColumn(name = "supplier_id")
	public ContractorEntity getSupplier() {
		return supplier;
	}

	public void setSupplier(ContractorEntity supplier) {
		this.supplier = supplier;
	}

	@JsonbTransient
	@ManyToOne
	@JoinColumn(name = "debris_post_id", referencedColumnName = "id", nullable = false)
	public DebrisPostEntity getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(DebrisPostEntity debrisPostByDebrisPostId) {
		this.debrisPost = debrisPostByDebrisPostId;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "debrisBid")
	public List<DebrisTransactionEntity> getDebrisTransactions() {
		return debrisTransactions;
	}

	public void setDebrisTransactions(List<DebrisTransactionEntity> debrisTransactionsById) {
		this.debrisTransactions = debrisTransactionsById;
	}

	@Basic
	@Column(name = "description")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public enum Status{
		PENDING,
		ACCEPTED,
		FINISHED
	}
}
