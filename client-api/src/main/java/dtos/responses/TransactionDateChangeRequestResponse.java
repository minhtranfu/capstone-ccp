package dtos.responses;

import dtos.IdOnly;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TransactionDateChangeRequestResponse {
	private long id;
	private LocalDate requestedEndDate;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private TransactionDateChangeRequestEntity.Status status;
	private boolean isDeleted;
	private IdOnly hiringTransactionEntity;

	public TransactionDateChangeRequestResponse() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public LocalDate getRequestedEndDate() {
		return requestedEndDate;
	}

	public void setRequestedEndDate(LocalDate requestedEndDate) {
		this.requestedEndDate = requestedEndDate;
	}

	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	public TransactionDateChangeRequestEntity.Status getStatus() {
		return status;
	}

	public void setStatus(TransactionDateChangeRequestEntity.Status status) {
		this.status = status;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	public IdOnly getHiringTransactionEntity() {
		return hiringTransactionEntity;
	}

	public void setHiringTransactionEntity(IdOnly hiringTransactionEntity) {
		this.hiringTransactionEntity = hiringTransactionEntity;
	}
}
