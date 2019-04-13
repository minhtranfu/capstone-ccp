package entities;

import listeners.entityListenters.MaterialTransactionEntityListener;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.Where;

import javax.enterprise.inject.Default;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "material_transaction", schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "MaterialTransactionEntity.BySupplierId", query = "select e from MaterialTransactionEntity  e where e.supplier.id = :supplierId")
		, @NamedQuery(name = "MaterialTransactionEntity.ByRequesterId", query = "select e from MaterialTransactionEntity  e where e.requester.id = :requesterId")

})
@EntityListeners({MaterialTransactionEntityListener.class})
@DynamicInsert
public class MaterialTransactionEntity {
	private long id;

	@NotNull
	private Double totalPrice;
	@NotNull
	@NotBlank
	private String requesterAddress;
	@NotNull
	@Min(-90)
	@Max(90)
	private Double requesterLat;
	@NotNull
	@Min(-180)
	@Max(180)
	private Double requesterLong;

	private String cancelReason;
	private ContractorEntity canceledBy;


	@NotNull
	private Status status;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	private List<MaterialTransactionDetailEntity> materialTransactionDetails;

	@NotNull
	private ContractorEntity requester;
	@NotNull
	private ContractorEntity supplier;

	@Id
	@GeneratedValue()
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "total_price", nullable = true, precision = 0)
	public Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Double price) {
		this.totalPrice = price;
	}



	@Basic
	@Column(name = "requester_address", nullable = true, length = 256)
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
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
	@Column(name = "requester_long", nullable = true, precision = 0)
	public Double getRequesterLong() {
		return requesterLong;
	}

	public void setRequesterLong(Double requesterLong) {
		this.requesterLong = requesterLong;
	}


	@Basic
	@Column(name = "cancel_reason")
	public String getCancelReason() {
		return cancelReason;
	}

	public void setCancelReason(String cancelReason) {
		this.cancelReason = cancelReason;
	}

	@ManyToOne
	@JoinColumn(name = "canceled_by")
	public ContractorEntity getCanceledBy() {
		return canceledBy;
	}

	public void setCanceledBy(ContractorEntity canceledBy) {
		this.canceledBy = canceledBy;
	}

	@Basic
	@Column(name = "status", nullable = true, length = 256)
	@Enumerated(EnumType.STRING)
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
	@Column(name = "is_deleted", nullable = true, insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@OneToMany(mappedBy = "materialTransaction", cascade = {CascadeType.ALL}, orphanRemoval = true)
	public List<MaterialTransactionDetailEntity> getMaterialTransactionDetails() {
		return materialTransactionDetails;
	}

	public void setMaterialTransactionDetails(List<MaterialTransactionDetailEntity> materialTransactionDetails) {
		this.materialTransactionDetails = materialTransactionDetails;
	}

	@ManyToOne()
	@JoinColumn(name = "requester_id", referencedColumnName = "id")
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

	public enum Status{
		PENDING,
		ACCEPTED,
		DENIED,
		DELIVERING,
		CANCELED,
		FINISHED
	}
}
