package entities;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import java.sql.Timestamp;

@Entity
@Table(name = "available_time_range", schema = "capstone_ccp", catalog = "")
public class AvailableTimeRangeEntity {
	private long id;
	private Timestamp beginDate;
	private Timestamp endDate;
	private EquipmentEntity equipment;

	@XmlTransient
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


	@XmlTransient
	@ManyToOne(fetch = FetchType.LAZY)
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}
}
