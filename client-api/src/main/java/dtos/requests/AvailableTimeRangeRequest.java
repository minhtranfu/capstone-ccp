package dtos.requests;

import entities.EquipmentEntity;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;

public class AvailableTimeRangeRequest {

	@NotNull
	public LocalDate beginDate;

	@NotNull
	public LocalDate endDate;

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
}
