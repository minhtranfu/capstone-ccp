package entities;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "available_time_range", schema = "capstone_ccp", catalog = "")
public class AvailableTimeRangeEntity {
	long getId;
	private long id;
	private Timestamp beginDate;
	private Timestamp endDate;
	private Integer equipmentId;

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

	@Basic
	@Column(name = "equipment_id", nullable = true)
	public Integer getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(Integer equipmentId) {
		this.equipmentId = equipmentId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AvailableTimeRangeEntity that = (AvailableTimeRangeEntity) o;

		if (id != that.id) return false;
		if (beginDate != null ? !beginDate.equals(that.beginDate) : that.beginDate != null) return false;
		if (endDate != null ? !endDate.equals(that.endDate) : that.endDate != null) return false;
		if (equipmentId != null ? !equipmentId.equals(that.equipmentId) : that.equipmentId != null) return false;

		return true;
	}

}
