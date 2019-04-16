package dtos.responses;

import entities.*;

import java.time.LocalDateTime;

public class ContractorResponse {

	private long id;

	private String name;

	private String email;

	private String phoneNumber;
	private String thumbnailImageUrl;

	private ContractorEntity.Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;



//	private List<EquipmentEntity> equipments;
//	private List<MaterialEntity> materials;
//	private List<ConstructionEntity> constructions;

//	private List<FeedbackEntity> sentFeedback;
//	private List<FeedbackEntity> receivedFeedback;
//	private List<NotificationDeviceTokenEntity> notificationDeviceTokens;
//	private List<SubscriptionEntity> subscriptionEntities;

//	private List<NotificationEntity> notifications;

//	private List<DebrisFeedbackEntity> debrisFeedbacks;
	private int debrisFeedbacksCount;
	private double averageDebrisRating;

//	private List<MaterialFeedbackEntity> materialFeedbacks;
	private int materialFeedbacksCount;
	private double averageMaterialRating;


//	private List<EquipmentFeedbackEntity> equipmentFeedbacks;
	private double averageEquipmentRating;
	private int equipmentFeedbacksCount;


	private long finishedHiringTransactionCount;
	private long finishedMaterialTransactionCount;
	private long finishedDebrisTransactionCount;

	private long finishedCanceledHiringTransactionCount;
	private long finishedCanceledMaterialTransactionCount;
	private long finishedCanceledDebrisTransactionCount;





	public ContractorResponse() {
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

	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}

	public void setThumbnailImageUrl(String thumbnailImageUrl) {
		this.thumbnailImageUrl = thumbnailImageUrl;
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

	public long getFinishedHiringTransactionCount() {
		return finishedHiringTransactionCount;
	}

	public void setFinishedHiringTransactionCount(long finishedHiringTransactionCount) {
		this.finishedHiringTransactionCount = finishedHiringTransactionCount;
	}

	public long getFinishedMaterialTransactionCount() {
		return finishedMaterialTransactionCount;
	}

	public void setFinishedMaterialTransactionCount(long finishedMaterialTransactionCount) {
		this.finishedMaterialTransactionCount = finishedMaterialTransactionCount;
	}

	public long getFinishedDebrisTransactionCount() {
		return finishedDebrisTransactionCount;
	}

	public void setFinishedDebrisTransactionCount(long finishedDebrisTransactionCount) {
		this.finishedDebrisTransactionCount = finishedDebrisTransactionCount;
	}

	public long getFinishedCanceledHiringTransactionCount() {
		return finishedCanceledHiringTransactionCount;
	}

	public void setFinishedCanceledHiringTransactionCount(long finishedCanceledHiringTransactionCount) {
		this.finishedCanceledHiringTransactionCount = finishedCanceledHiringTransactionCount;
	}

	public long getFinishedCanceledMaterialTransactionCount() {
		return finishedCanceledMaterialTransactionCount;
	}

	public void setFinishedCanceledMaterialTransactionCount(long finishedCanceleMaterialTransactionCount) {
		this.finishedCanceledMaterialTransactionCount = finishedCanceleMaterialTransactionCount;
	}

	public long getFinishedCanceledDebrisTransactionCount() {
		return finishedCanceledDebrisTransactionCount;
	}

	public void setFinishedCanceledDebrisTransactionCount(long finishedCanceleDebrisTransactionCount) {
		this.finishedCanceledDebrisTransactionCount = finishedCanceleDebrisTransactionCount;
	}
}
