package dtos.requests;


import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class HiringTransactionRequest {

	@NotNull
	private LocalDate beginDate;

	@NotNull
	private LocalDate endDate;
	@NotNull
	private String requesterAddress;
	@NotNull
	private double requesterLatitude;
	@NotNull
	private double requesterLongitude;

	@NotNull
	private long equipmentId;

	private long requesterId;

	public HiringTransactionRequest() {
	}

	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
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

	public long getRequesterId() {
		return requesterId;
	}

	public void setRequesterId(long requesterId) {
		this.requesterId = requesterId;
	}
}
