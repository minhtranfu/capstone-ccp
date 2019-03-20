package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "material_transaction", schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "MaterialTransactionEntity.BySupplierId", query = "select e from MaterialTransactionEntity  e where e.material.contractor.id = :supplierId")
		, @NamedQuery(name = "MaterialTransactionEntity.ByRequesterId", query = "select e from MaterialTransactionEntity  e where e.requester.id = :requesterId")

})
public class MaterialTransactionEntity {
	private long id;
	@Positive
	private Double price;

	@Positive
	private Integer quantity;

	private String unit;

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

	@NotNull
	@NotBlank
	private String materialAddress;

	@NotNull
	@Min(-90)
	@Max(90)
	private Double materialLat;

	@NotNull
	@Min(-180)
	@Max(180)
	private Double materialLong;

	private Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	@NotNull
	private MaterialEntity material;
	@NotNull
	private ContractorEntity requester;

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
	@Column(name = "price", nullable = true, precision = 0)
	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	@Basic
	@Column(name = "quantity", nullable = true)
	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {


		this.quantity = quantity;
	}

	@Basic
	@Column(name = "unit")
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
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
	@Column(name = "material_address", nullable = true, length = 256)
	public String getMaterialAddress() {
		return materialAddress;
	}

	public void setMaterialAddress(String materialAddress) {
		this.materialAddress = materialAddress;
	}

	@Basic
	@Column(name = "material_lat", nullable = true, precision = 0)
	public Double getMaterialLat() {
		return materialLat;
	}

	public void setMaterialLat(Double materialLat) {
		this.materialLat = materialLat;
	}

	@Basic
	@Column(name = "material_long", nullable = true, precision = 0)
	public Double getMaterialLong() {
		return materialLong;
	}

	public void setMaterialLong(Double materialLong) {
		this.materialLong = materialLong;
	}

	@Basic
	@Column(name = "status", nullable = true, length = 256, insertable = false)
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
	@Column(name = "is_deleted", nullable = true)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@ManyToOne
	@JoinColumn(name = "material_id", referencedColumnName = "id")
	public MaterialEntity getMaterial() {
		return material;
	}

	public void setMaterial(MaterialEntity materialByMaterialId) {
		this.material = materialByMaterialId;
	}


	@ManyToOne()
	@JoinColumn(name = "requester_id", referencedColumnName = "id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
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
