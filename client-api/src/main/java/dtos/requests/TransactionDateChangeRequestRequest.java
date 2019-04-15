package dtos.requests;

import dtos.IdOnly;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDateChangeRequestRequest {


	@NotNull
	private LocalDate requestedEndDate;


	@NotNull
	@Valid
	private IdOnly hiringTransactionEntity;

	public TransactionDateChangeRequestRequest() {
	}

	public LocalDate getRequestedEndDate() {
		return requestedEndDate;
	}

	public void setRequestedEndDate(LocalDate requestedEndDate) {
		this.requestedEndDate = requestedEndDate;
	}

	public IdOnly getHiringTransactionEntity() {
		return hiringTransactionEntity;
	}

	public void setHiringTransactionEntity(IdOnly hiringTransactionEntity) {
		this.hiringTransactionEntity = hiringTransactionEntity;
	}
}
