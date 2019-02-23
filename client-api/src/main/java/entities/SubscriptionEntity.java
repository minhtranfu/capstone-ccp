package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Date;
import java.sql.Timestamp;


@Entity
@Where(clause = "is_deleted=0")
@Table(name = "subscription", schema = "capstone_ccp", catalog = "")
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
	private int maxDistance;
	private double maxPrice;

	private Date beginDate;
	private Date endDate;
	private Timestamp createdTime;
	private Timestamp updatedTime;

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

	public int getMaxDistance() {
		return maxDistance;
	}

	public void setMaxDistance(int maxDistance) {
		this.maxDistance = maxDistance;
	}

	public double getMaxPrice() {
		return maxPrice;
	}

	public void setMaxPrice(double maxPrice) {
		this.maxPrice = maxPrice;
	}

	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}
}
