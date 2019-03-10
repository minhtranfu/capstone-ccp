package dtos.requests;


import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDate;

public class HiringTransactionRequest {

	private LocalDate beginDate;
	private LocalDate endDate;
	private String requesterAddress;
	private double requesterLatitude;
	private double requesterLongitude;
	private long equipmentId;
	private long requesterId;

	public HiringTransactionRequest() {
	}


	@NotNull
	public LocalDate getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(LocalDate beginDate) {
		this.beginDate = beginDate;
	}

	@NotNull
	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	@NotNull
	@NotEmpty
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	@NotNull
	@Positive
	public double getRequesterLatitude() {
		return requesterLatitude;
	}

	public void setRequesterLatitude(double requesterLatitude) {
		this.requesterLatitude = requesterLatitude;
	}

	@NotNull
	@Positive
	public double getRequesterLongitude() {
		return requesterLongitude;
	}

	public void setRequesterLongitude(double requesterLongitude) {
		this.requesterLongitude = requesterLongitude;
	}


	@NotNull
	@Positive
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
