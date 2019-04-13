package dtos.responses;

import dtos.IdOnly;
import entities.ContractorEntity;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisTransactionEntity;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class DebrisBidResponse {

	private long id;

	private double price;
	private DebrisBidEntity.Status status;

	private String description;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private boolean isDeleted;

	@NotNull
	private IdOnly supplier;
	@NotNull
	private DebrisBidDebrisPostResponse debrisPost;

	public DebrisBidResponse() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}

	public DebrisBidEntity.Status getStatus() {
		return status;
	}

	public void setStatus(DebrisBidEntity.Status status) {
		this.status = status;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
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

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	public IdOnly getSupplier() {
		return supplier;
	}

	public void setSupplier(IdOnly supplier) {

		this.supplier = supplier;
	}

	public DebrisBidDebrisPostResponse getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(DebrisBidDebrisPostResponse debrisPost) {
		this.debrisPost = debrisPost;
	}
}
