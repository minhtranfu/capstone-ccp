package dtos.responses;

import entities.*;

import java.time.LocalDateTime;
import java.util.List;

public class ContractorResponse {

	private long id;

	private String name;

	private String email;

	private String phoneNumber;
	private String thumbnailImage;

	private ContractorEntity.Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;



//	private List<EquipmentEntity> equipments;
//	private List<MaterialEntity> materials;
	private List<ConstructionEntity> constructions;

//	private List<FeedbackEntity> sentFeedback;
//	private List<FeedbackEntity> receivedFeedback;
//	private List<NotificationDeviceTokenEntity> notificationDeviceTokens;
//	private List<SubscriptionEntity> subscriptionEntities;

//	private List<NotificationEntity> notifications;

	private List<DebrisFeedbackEntity> debrisFeedbacks;

	private int debrisFeedbacksCount;

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

	public List<DebrisFeedbackEntity> getDebrisFeedbacks() {
		return debrisFeedbacks;
	}

	public void setDebrisFeedbacks(List<DebrisFeedbackEntity> debrisFeedbacks) {
		this.debrisFeedbacks = debrisFeedbacks;
	}

	public int getDebrisFeedbacksCount() {
		return debrisFeedbacksCount;
	}

	public void setDebrisFeedbacksCount(int debrisFeedbacksCount) {
		this.debrisFeedbacksCount = debrisFeedbacksCount;
	}

	public List<ConstructionEntity> getConstructions() {
		return constructions;
	}

	public void setConstructions(List<ConstructionEntity> constructions) {
		this.constructions = constructions;
	}
}
