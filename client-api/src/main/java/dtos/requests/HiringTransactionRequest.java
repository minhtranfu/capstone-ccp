package dtos.requests;


import javax.validation.constraints.NotNull;
import java.sql.Date;

public class HiringTransactionRequest {

	@NotNull
	private Date beginDate;

	@NotNull
	private Date endDate;
	@NotNull
	private String requesterAddress;
	@NotNull
	private double requesterLatitude;
	@NotNull
	private double requesterLongitude;

	@NotNull
	private long equipmentId;

	public HiringTransactionRequest() {
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

	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	public double getRequesterLatitude() {
		return requesterLatitude;
	}

	public void setRequesterLatitude(double requesterLatitude) {
		this.requesterLatitude = requesterLatitude;
	}

	public double getRequesterLongitude() {
		return requesterLongitude;
	}

	public void setRequesterLongitude(double requesterLongitude) {
		this.requesterLongitude = requesterLongitude;
	}

	public long getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(long equipmentId) {
		this.equipmentId = equipmentId;
	}


}
