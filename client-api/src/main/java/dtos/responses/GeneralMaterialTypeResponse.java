package dtos.responses;

import entities.MaterialTypeEntity;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

public class GeneralMaterialTypeResponse {

	private long id;

	private String name;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	private List<MaterialTypeEntity> materialTypes;

	public GeneralMaterialTypeResponse() {
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public List<MaterialTypeEntity> getMaterialTypes() {
		return materialTypes;
	}

	public void setMaterialTypes(List<MaterialTypeEntity> materialTypes) {
		this.materialTypes = materialTypes;
	}
}
