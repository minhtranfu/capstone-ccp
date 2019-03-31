package dtos.responses;

import entities.ContractorEntity;
import entities.DebrisFeedbackEntity;
import entities.EquipmentFeedbackEntity;
import entities.MaterialFeedbackEntity;

import java.time.LocalDateTime;
import java.util.List;

public class TokenContractorResponse {
	private long id;

	private String name;

	private String email;

	private String phoneNumber;
	private String thumbnailImage;

	private ContractorEntity.Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

	private long totalUnreadNotifications;

	private int materialFeedbacksCount;
	private double averageMaterialRating;


	private int debrisFeedbacksCount;
	private double averageDebrisRating;



	private double averageEquipmentRating;
	private int equipmentFeedbacksCount;


	public TokenContractorResponse() {
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public String getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(String thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
	}

	public ContractorEntity.Status getStatus() {
		return status;
	}

	public void setStatus(ContractorEntity.Status status) {
		this.status = status;
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

	public long getTotalUnreadNotifications() {
		return totalUnreadNotifications;
	}

	public void setTotalUnreadNotifications(long totalUnreadNotifications) {
		this.totalUnreadNotifications = totalUnreadNotifications;
	}

	public int getMaterialFeedbacksCount() {
		return materialFeedbacksCount;
	}

	public void setMaterialFeedbacksCount(int materialFeedbacksCount) {
		this.materialFeedbacksCount = materialFeedbacksCount;
	}

	public double getAverageMaterialRating() {
		return averageMaterialRating;
	}

	public void setAverageMaterialRating(double averageMaterialRating) {
		this.averageMaterialRating = averageMaterialRating;
	}

	public int getDebrisFeedbacksCount() {
		return debrisFeedbacksCount;
	}

	public void setDebrisFeedbacksCount(int debrisFeedbacksCount) {
		this.debrisFeedbacksCount = debrisFeedbacksCount;
	}

	public double getAverageDebrisRating() {
		return averageDebrisRating;
	}

	public void setAverageDebrisRating(double averageDebrisRating) {
		this.averageDebrisRating = averageDebrisRating;
	}

	public double getAverageEquipmentRating() {
		return averageEquipmentRating;
	}

	public void setAverageEquipmentRating(double averageEquipmentRating) {
		this.averageEquipmentRating = averageEquipmentRating;
	}

	public int getEquipmentFeedbacksCount() {
		return equipmentFeedbacksCount;
	}

	public void setEquipmentFeedbacksCount(int equipmentFeedbacksCount) {
		this.equipmentFeedbacksCount = equipmentFeedbacksCount;
	}
}
