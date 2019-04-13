package dtos.requests;

import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDateChangeRequestRequest {

	@NotNull
	public LocalDate requestedBeginDate;
	@NotNull
	public LocalDate requestedEndDate;
}
