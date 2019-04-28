package entities;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "subscription_matched_log", schema = "capstone_ccp")
public class SubscriptionMatchedLogEntity {
	private long id;
	private long matchedSubscriptionId;
	private long matchedEquipmentId;
	private long contractorId;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

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
	@Column(name = "matched_subscription_id", nullable = false)
	public long getMatchedSubscriptionId() {
		return matchedSubscriptionId;
	}

	public void setMatchedSubscriptionId(long matchedSubscriptionId) {
		this.matchedSubscriptionId = matchedSubscriptionId;
	}

	@Basic
	@Column(name = "matched_equipment_id", nullable = false)
	public long getMatchedEquipmentId() {
		return matchedEquipmentId;
	}

	public void setMatchedEquipmentId(long matchedEquipmentId) {
		this.matchedEquipmentId = matchedEquipmentId;
	}

	@Basic
	@Column(name = "contractor_id", nullable = false)
	public long getContractorId() {
		return contractorId;
	}

	public void setContractorId(long contractorId) {
		this.contractorId = contractorId;
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
		SubscriptionMatchedLogEntity that = (SubscriptionMatchedLogEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
