package entities;

import listeners.entityListenters.MaterialTransactionDetailEntityListener;
import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "material_transaction_detail", schema = "capstone_ccp", catalog = "")
@Where(clause = "is_deleted=0")
@EntityListeners(MaterialTransactionDetailEntityListener.class)
public class MaterialTransactionDetailEntity {
	private long id;
	@Positive
	@NotNull
	private double quantity;

	@NotNull
	@NotEmpty
	private String unit;

	@Positive
	@NotNull
	private double price;

	@NotNull
	@Min(-90)
	@Max(90)
	private Double materialLat;

	@NotNull
	@Min(-180)
	@Max(180)
	private Double materialLong;

	@NotNull
	@NotBlank
	private String materialAddress;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	@NotNull
	private MaterialEntity material;

	@NotNull
	private MaterialTransactionEntity materialTransaction;

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
	@Column(name = "quantity", nullable = false, precision = 0)
	public double getQuantity() {
		return quantity;
	}

	public void setQuantity(double quantity) {
		this.quantity = quantity;
	}

	@Basic
	@Column(name = "unit", nullable = false, length = 256)
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
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
	@Column(name = "material_lat", nullable = false, precision = 0)
	public @NotNull @Min(-90) @Max(90) Double getMaterialLat() {
		return materialLat;
	}

	public void setMaterialLat(@NotNull @Min(-90) @Max(90) Double materialLat) {
		this.materialLat = materialLat;
	}

	@Basic
	@Column(name = "material_long", nullable = false, precision = 0)
	public @NotNull @Min(-180) @Max(180) Double getMaterialLong() {
		return materialLong;
	}

	public void setMaterialLong(@NotNull @Min(-180) @Max(180) Double materialLong) {
		this.materialLong = materialLong;
	}

	@Basic
	@Column(name = "material_address", nullable = true, length = 1000)
	public String getMaterialAddress() {
		return materialAddress;
	}

	public void setMaterialAddress(String materialAddress) {
		this.materialAddress = materialAddress;
	}

	@Basic
	@Column(name = "created_time", nullable = true)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = true)
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
	@JoinColumn(name = "material_id")
	public MaterialEntity getMaterial() {
		return material;
	}

	public void setMaterial(MaterialEntity material) {
		this.material = material;
	}


	@JsonbTransient
	@ManyToOne
	@JoinColumn(name = "material_transaction_id")
	public MaterialTransactionEntity getMaterialTransaction() {
		return materialTransaction;
	}

	public void setMaterialTransaction(MaterialTransactionEntity materialTransaction) {
		this.materialTransaction = materialTransaction;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		MaterialTransactionDetailEntity that = (MaterialTransactionDetailEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
