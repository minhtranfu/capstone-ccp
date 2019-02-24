package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.naming.Name;
import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import java.sql.Timestamp;

@Entity
@Table(name = "available_time_range", schema = "capstone_ccp")
@NamedQuery(name = "AvailableTimeRangeEntity.searchTimeRangeInDate",query = "select t from AvailableTimeRangeEntity t where t.equipment.id =:equipmentId and t.beginDate <= :curBeginDate  and  :curEndDate <= t.endDate")
public class AvailableTimeRangeEntity {
	private long id;
	private Timestamp beginDate;
	private Timestamp endDate;
	private EquipmentEntity equipment;

	@JsonbTransient
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
	@Column(name = "begin_date", nullable = true)
	public Timestamp getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Timestamp beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date", nullable = true)
	public Timestamp getEndDate() {
		return endDate;
	}

	public void setEndDate(Timestamp endDate) {
		this.endDate = endDate;
	}


	@JsonbTransient
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "equipment_id")
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;


	}

}
