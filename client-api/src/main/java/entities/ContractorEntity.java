package entities;

import daos.DebrisFeedbackDAO;
import daos.EquipmentFeedbackDAO;
import daos.MaterialFeedbackDAO;
import org.hibernate.annotations.JoinFormula;
import org.hibernate.annotations.Where;

import javax.inject.Inject;
import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.xml.bind.annotation.XmlTransient;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity

@Table(name = "contractor", schema = "capstone_ccp")
@Where(clause = "is_deleted=0")
@NamedQueries({
		@NamedQuery(name = "ContractorEntity.finishedHiringTransactionBySupplierId", query = "select COUNT(e) from HiringTransactionEntity e where e.equipment.contractor.id = :supplierId and e.status = 'FINISHED'")
		, @NamedQuery(name = "ContractorEntity.finishedMaterialTransactionBySupplierId", query = "select COUNT(e) from MaterialTransactionEntity e where e.supplier.id  = :supplierId and e.status = 'FINISHED'")
		, @NamedQuery(name = "ContractorEntity.finishedDebrisTransactionBySupplierId", query = "select COUNT(e) from DebrisTransactionEntity e where e.supplier.id = :supplierId and e.status = 'FINISHED'")
		, @NamedQuery(name = "ContractorEntity.finishedCanceledHiringTransactionBySupplierId", query = "select COUNT(e) from HiringTransactionEntity e where e.equipment.contractor.id = :supplierId and e.status = 'FINISHED' or e.status= 'CANCLED'")
		, @NamedQuery(name = "ContractorEntity.finishedCanceledMaterialTransactionBySupplierId", query = "select COUNT(e) from MaterialTransactionEntity e where e.supplier.id  = :supplierId and e.status = 'FINISHED' or e.status = 'CANCELED'")
		, @NamedQuery(name = "ContractorEntity.finishedCanceledDebrisTransactionRateBySupplierId", query = "select COUNT(e) from DebrisTransactionEntity e where e.supplier.id = :supplierId and e.status = 'FINISHED' or e.status = 'CANCELED'")

}
)
public class ContractorEntity {
	private long id;

	private String name;

	private String email;

	private String phoneNumber;
	private String thumbnailImageUrl;

	private boolean emailVerified;
	private boolean phoneNumberVerified;
	private Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;


	private List<EquipmentEntity> equipments;
	private List<MaterialEntity> materials;
	private List<ConstructionEntity> constructions;

	private List<ReportEntity> sentReports;
	private List<ReportEntity> receivedReports;
	private List<NotificationDeviceTokenEntity> notificationDeviceTokens;
	private List<SubscriptionEntity> subscriptionEntities;

	private List<NotificationEntity> notifications;
	private List<NotificationEntity> unreadNotification;

	private Collection<ContractorVerifyingImageEntity> contractorVerifyingImages;


	private List<DebrisFeedbackEntity> debrisFeedbacks;
//	private double averageDebrisRating;

	private List<MaterialFeedbackEntity> materialFeedbacks;
//	private double averageMaterialRating;

	private List<EquipmentFeedbackEntity> equipmentFeedbacks;
//	private double averageEquipmentRating;


	public ContractorEntity() {
	}


	@JsonbTransient
	@XmlTransient
	@OneToMany(cascade =
			{CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH},
			orphanRemoval = false,
			mappedBy = "contractor"
			, fetch = FetchType.LAZY)
	@Where(clause = "is_deleted=0")
	public List<EquipmentEntity> getEquipments() {
		return equipments;
	}

	public void setEquipments(List<EquipmentEntity> equipments) {
		this.equipments = equipments;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "contractor")
	@Where(clause = "is_deleted=0")
	public List<MaterialEntity> getMaterials() {
		return materials;
	}

	public void setMaterials(List<MaterialEntity> materials) {
		this.materials = materials;
	}

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "email", nullable = true, length = 255)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Basic
	@Column(name = "phone_number", nullable = true, length = 45)
	public String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(String phonenumber) {
		this.phoneNumber = phonenumber;
	}

	@Column(name = "email_verified")
	public boolean isEmailVerified() {
		return emailVerified;
	}

	public void setEmailVerified(boolean emailVerified) {
		this.emailVerified = emailVerified;
	}

	@Column(name = "phone_number_verified")
	public boolean isPhoneNumberVerified() {
		return phoneNumberVerified;
	}

	public void setPhoneNumberVerified(boolean phoneNumberVerified) {
		this.phoneNumberVerified = phoneNumberVerified;
	}

	@Basic
	@Column(name = "thumbnail_image_url", nullable = true, length = 255)
	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}

	public void setThumbnailImageUrl(String thumbnailImage) {
		this.thumbnailImageUrl = thumbnailImage;
	}

	@Basic
	@Enumerated(EnumType.STRING)
	@Column(name = "status", insertable = false, updatable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}


	//	@JsonbDateFormat("hh:mm:ss dd:MM:yyyy")
	@Basic
	@Column(name = "created_time", insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}


	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {
		this.updatedTime = updatedTime;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "contractor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@Where(clause = "is_deleted=0")
	public List<ConstructionEntity> getConstructions() {
		return constructions;
	}


	public void addConstruction(ConstructionEntity constructionEntity) {
		constructionEntity.setContractor(this);
		constructions.add(constructionEntity);
	}

	public void removeConstruction(ConstructionEntity constructionEntity) {
		constructionEntity.setContractor(null);
		constructions.remove(constructionEntity);
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "fromContractor", fetch = FetchType.LAZY, cascade = {})
	@Where(clause = "is_deleted = 0")
	public List<ReportEntity> getSentReports() {
		return sentReports;
	}

	public void setSentReports(List<ReportEntity> sentFeedback) {
		this.sentReports = sentFeedback;
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "toContractor", fetch = FetchType.LAZY, cascade = {})
	@Where(clause = "is_deleted = 0")
	public List<ReportEntity> getReceivedReports() {
		return receivedReports;
	}

	public void setReceivedReports(List<ReportEntity> receivedFeedback) {
		this.receivedReports = receivedFeedback;
	}


	public void setConstructions(List<ConstructionEntity> constructions) {
		this.constructions = constructions;
	}


	@OneToMany(mappedBy = "contractor")
	@JsonbTransient
	public List<NotificationDeviceTokenEntity> getNotificationDeviceTokens() {
		return notificationDeviceTokens;
	}

	public void setNotificationDeviceTokens(List<NotificationDeviceTokenEntity> notificationDeviceTokens) {
		this.notificationDeviceTokens = notificationDeviceTokens;
	}

	@JsonbTransient
	@Transient
	public boolean isActivated() {
		return status == Status.ACTIVATED;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "contractor")
	public List<SubscriptionEntity> getSubscriptionEntities() {
		return subscriptionEntities;
	}

	public void setSubscriptionEntities(List<SubscriptionEntity> subscriptionEntities) {
		this.subscriptionEntities = subscriptionEntities;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "contractor")
	public List<NotificationEntity> getNotifications() {
		return notifications;
	}

	public void setNotifications(List<NotificationEntity> notifications) {


		this.notifications = notifications;
	}


	@JsonbTransient
	@OneToMany(mappedBy = "contractor", cascade = {})
	public Collection<ContractorVerifyingImageEntity> getContractorVerifyingImages() {
		return contractorVerifyingImages;
	}

	public void setContractorVerifyingImages(Collection<ContractorVerifyingImageEntity> contractorVerifyingImages) {
		this.contractorVerifyingImages = contractorVerifyingImages;
	}

	public void addContractorVerifyingImage(ContractorVerifyingImageEntity contractorVerifyingImageEntity) {
		this.contractorVerifyingImages.add(contractorVerifyingImageEntity);
		contractorVerifyingImageEntity.setContractor(this);
	}

	public void removeContractorVerifyingImage(ContractorVerifyingImageEntity contractorVerifyingImageEntity) {
		this.contractorVerifyingImages.remove(contractorVerifyingImageEntity);
		contractorVerifyingImageEntity.setContractor(null);
	}


	@OneToMany(mappedBy = "supplier")
	@JsonbTransient
	@XmlTransient
	public List<DebrisFeedbackEntity> getDebrisFeedbacks() {
		return debrisFeedbacks;
	}

	public void setDebrisFeedbacks(List<DebrisFeedbackEntity> debrisFeedbacks) {
		this.debrisFeedbacks = debrisFeedbacks;
	}

	@Transient
	public int getDebrisFeedbacksCount() {
		return getDebrisFeedbacks() != null ? getDebrisFeedbacks().size() : 0;
	}

	@Transient
	public double getAverageDebrisRating() {
		return getDebrisFeedbacks().stream()
				.mapToDouble(DebrisFeedbackEntity::getRating).average().orElse(0);
	}

//	public void setAverageDebrisRating(double averageDebrisRating) {
//		this.averageDebrisRating = averageDebrisRating;
//	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "supplier")
	public List<MaterialFeedbackEntity> getMaterialFeedbacks() {
		return materialFeedbacks;
	}

	public void setMaterialFeedbacks(List<MaterialFeedbackEntity> materialFeedbacks) {
		this.materialFeedbacks = materialFeedbacks;
	}

	@Transient
	public int getMaterialFeedbacksCount() {
		return getMaterialFeedbacks() != null ? getMaterialFeedbacks().size() : 0;
	}

	@Transient
//	@JoinFormula("(select avg(rating) from material_feedback where supplier_id = 13)")
	public double getAverageMaterialRating() {
		return getMaterialFeedbacks().stream()
				.mapToDouble(MaterialFeedbackEntity::getRating).average().orElse(0);
	}
//
//	public void setAverageMaterialRating(double averageMaterialRating) {
//		this.averageMaterialRating = averageMaterialRating;
//	}


	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "supplier")
	public List<EquipmentFeedbackEntity> getEquipmentFeedbacks() {
		return equipmentFeedbacks;
	}

	public void setEquipmentFeedbacks(List<EquipmentFeedbackEntity> equipmentFeedbacks) {
		this.equipmentFeedbacks = equipmentFeedbacks;
	}

	@Transient
	public int getEquipmentFeedbacksCount() {
		return getEquipmentFeedbacks() != null ? getEquipmentFeedbacks().size() : 0;
	}

	@Transient
	public double getAverageEquipmentRating() {
		return getEquipmentFeedbacks().stream()
				.mapToDouble(EquipmentFeedbackEntity::getRating).average().orElse(0);
	}



//	@PostLoad
//	@JsonbTransient
//	void postLoad() {
//		this.averageDebrisRating = debrisFeedbackDAO.calculateAverageDebrisRating(getId());
//		this.averageMaterialRating = materialFeedbackDAO.calculateAverageMaterialRating(getId());
//		this.averageEquipmentRating = equipmentFeedbackDAO.calculateAverageEquipmentRating(getId());
//		this.averageDebrisRating = getDebrisFeedbacks().stream()
//				.mapToDouble(DebrisFeedbackEntity::getRating).average().orElse(0);
//		this.averageMaterialRating = getMaterialFeedbacks().stream()
//				.mapToDouble(MaterialFeedbackEntity::getRating).average().orElse(0);
//		this.averageEquipmentRating = getEquipmentFeedbacks().stream()
//				.mapToDouble(EquipmentFeedbackEntity::getRating).average().orElse(0);
//	}


	public enum Status {
		NOT_VERIFIED("not verified"),
		ACTIVATED("activated"),
		DEACTIVATED("deactivated");

		private String beautifiedName;

		Status(String beautifiedName) {

			this.beautifiedName = beautifiedName;
		}

		public String getBeautifiedName() {
			return beautifiedName;
		}

	}
}
