package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalDate;


@Entity
@Table(name = "subscription", schema = "capstone_ccp")
@NamedNativeQuery(name = "SubscriptionEntity.matchEquipment"
		,resultClass = SubscriptionEntity.class
		,query = "SELECT * from subscription s where s.equipment_type_id = :equipmentTypeId and "+
		"(s.max_price > :dailyPrice  or s.max_price =-1)" +
		//check exists equipment availble time range contain the subscribed time range\n"
		"and  exists (select * from available_time_range t where t.equipment_id = :equipmentId and t.begin_date <= s.begin_date  and  s.end_date <= t.end_date)"+
		// check equipment renting time not contain the subscribed time range
		"and not exists (select * from hiring_transaction h where h.equipment_id = :equipmentId and (h.status = 'ACCEPTED' or h.status = 'PROCESSING') and not (h.end_date > s.end_date or h.end_date< s.begin_date))")
public class SubscriptionEntity {
	private long id;
	private EquipmentTypeEntity equipmentType;
	private ContractorEntity contractor;
	private double maxPrice;

	private LocalDate beginDate;
	private LocalDate endDate;
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


	@ManyToOne
	@JoinColumn(name = "equipment_type_id")
	public EquipmentTypeEntity getEquipmentType() {
		return equipmentType;
	}


	public void setEquipmentType(EquipmentTypeEntity equipmentType) {
		this.equipmentType = equipmentType;
	}

	@ManyToOne
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}


	@Basic
	@Column(name = "max_price")
	public double getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(double maxPrice) {
		this.maxPrice = maxPrice;
	}

	@Basic
	@Column(name = "begin_date")
	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date")
	public LocalDate getEndDate() {
		return endDate;

	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	@Basic
	@Column(name = "created_time", insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}
}
