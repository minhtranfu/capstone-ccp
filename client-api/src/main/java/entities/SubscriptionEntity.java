package entities;

import listeners.entityListenters.SubscriptionEntityListener;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalDate;


@Entity
@Table(name = "subscription", schema = "capstone_ccp")
@EntityListeners(SubscriptionEntityListener.class)
@NamedNativeQueries({

@NamedNativeQuery(name = "SubscriptionEntity.matchEquipment"
		,resultClass = SubscriptionEntity.class
		,query = "SELECT * from subscription s where " +
		"(s.equipment_type_id = :equipmentTypeId or s.equipment_type_id is null or s.equipment_type_id =0)and "+
		"(s.max_price > :dailyPrice  or s.max_price =-1 or s.max_price is null)" +
		//check max distance ( require long lat not null)
		"and (getDistance(:equipmentId,s.id) <= max_distance or max_distance is null or max_distance = -1)"+
		//check exists equipment availble time range contain the subscribed time range\n"
		"and  exists (select * from available_time_range t where t.equipment_id = :equipmentId and t.begin_date <= s.begin_date  and  s.end_date <= t.end_date)"+
		// check equipment renting time not contain the subscribed time range

		"and not exists (select * from hiring_transaction h where h.equipment_id = :equipmentId and (h.status = 'ACCEPTED' or h.status = 'PROCESSING') and not (h.end_date > s.end_date or h.end_date< s.begin_date))")
})
public class SubscriptionEntity {
	private long id;
	private EquipmentTypeEntity equipmentType;
	private ContractorEntity contractor;
	private double maxPrice;

	private LocalDate beginDate;
	private LocalDate endDate;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private Double maxDistance;
	private Double latitude;
	private Double longitude;

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
	@NotNull
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

	@Basic
	@Column(name = "max_distance")
	public Double getMaxDistance() {
		return maxDistance;
	}

	public void setMaxDistance(Double maxDistance) {
		this.maxDistance = maxDistance;
	}

	@Basic
	@Column(name = "lat")
	@NotNull
	@Min(-90)
	@Max(90)
	public Double getLatitude() {
		return latitude;
	}

	public void setLatitude(Double latitude) {
		this.latitude = latitude;
	}

	@Basic
	@Column(name = "`long`")
	@NotNull
	@Min(-180)
	@Max(180)
	public Double getLongitude() {
		return longitude;
	}

	public void setLongitude(Double longitude) {
		this.longitude = longitude;
	}
}
