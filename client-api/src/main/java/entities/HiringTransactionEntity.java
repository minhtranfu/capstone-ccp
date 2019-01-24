package entities;

import javax.persistence.*;

@Entity
@Table(name = "hiring_transaction", schema = "capstone_ccp", catalog = "")
public class HiringTransactionEntity {
	private long id;
	private String status;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private Integer hiringTimeRange;
	private Integer supplierId;
	private Integer requesterId;
	private Integer supplierLocationId;
	private Integer requesterLocationId;
	private Integer equipmentId;
	private Integer hiringTimeRangeId;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "status", nullable = true, length = 45)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Basic
	@Column(name = "daily_price", nullable = true)
	public Integer getDailyPrice() {
		return dailyPrice;
	}

	public void setDailyPrice(Integer dailyPrice) {
		this.dailyPrice = dailyPrice;
	}

	@Basic
	@Column(name = "delivery_price", nullable = true)
	public Integer getDeliveryPrice() {
		return deliveryPrice;
	}

	public void setDeliveryPrice(Integer deliveryPrice) {
		this.deliveryPrice = deliveryPrice;
	}

	@Basic
	@Column(name = "hiring_time_range", nullable = true)
	public Integer getHiringTimeRange() {
		return hiringTimeRange;
	}

	public void setHiringTimeRange(Integer hiringTimeRange) {
		this.hiringTimeRange = hiringTimeRange;
	}

	@Basic
	@Column(name = "supplier_id", nullable = true)
	public Integer getSupplierId() {
		return supplierId;
	}

	public void setSupplierId(Integer supplierId) {
		this.supplierId = supplierId;
	}

	@Basic
	@Column(name = "requester_id", nullable = true)
	public Integer getRequesterId() {
		return requesterId;
	}

	public void setRequesterId(Integer requesterId) {
		this.requesterId = requesterId;
	}

	@Basic
	@Column(name = "supplier_location_id", nullable = true)
	public Integer getSupplierLocationId() {
		return supplierLocationId;
	}

	public void setSupplierLocationId(Integer supplierLocationId) {
		this.supplierLocationId = supplierLocationId;
	}

	@Basic
	@Column(name = "requester_location_id", nullable = true)
	public Integer getRequesterLocationId() {
		return requesterLocationId;
	}

	public void setRequesterLocationId(Integer requesterLocationId) {
		this.requesterLocationId = requesterLocationId;
	}

	@Basic
	@Column(name = "equipment_id", nullable = true)
	public Integer getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(Integer equipmentId) {
		this.equipmentId = equipmentId;
	}

	@Basic
	@Column(name = "hiring_time_range_id", nullable = true)
	public Integer getHiringTimeRangeId() {
		return hiringTimeRangeId;
	}

	public void setHiringTimeRangeId(Integer hiringTimeRangeId) {
		this.hiringTimeRangeId = hiringTimeRangeId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		HiringTransactionEntity that = (HiringTransactionEntity) o;

		if (id != that.id) return false;
		if (status != null ? !status.equals(that.status) : that.status != null) return false;
		if (dailyPrice != null ? !dailyPrice.equals(that.dailyPrice) : that.dailyPrice != null) return false;
		if (deliveryPrice != null ? !deliveryPrice.equals(that.deliveryPrice) : that.deliveryPrice != null)
			return false;
		if (hiringTimeRange != null ? !hiringTimeRange.equals(that.hiringTimeRange) : that.hiringTimeRange != null)
			return false;
		if (supplierId != null ? !supplierId.equals(that.supplierId) : that.supplierId != null) return false;
		if (requesterId != null ? !requesterId.equals(that.requesterId) : that.requesterId != null) return false;
		if (supplierLocationId != null ? !supplierLocationId.equals(that.supplierLocationId) : that.supplierLocationId != null)
			return false;
		if (requesterLocationId != null ? !requesterLocationId.equals(that.requesterLocationId) : that.requesterLocationId != null)
			return false;
		if (equipmentId != null ? !equipmentId.equals(that.equipmentId) : that.equipmentId != null) return false;
		if (hiringTimeRangeId != null ? !hiringTimeRangeId.equals(that.hiringTimeRangeId) : that.hiringTimeRangeId != null)
			return false;

		return true;
	}

}
