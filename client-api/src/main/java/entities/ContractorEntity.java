package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.xml.bind.annotation.XmlTransient;
import java.time.LocalDateTime;
import java.util.List;

@Entity

@Table(name = "contractor", schema = "capstone_ccp")
@Where(clause = "is_deleted=0")
public class ContractorEntity {
	private long id;
	private String name;
	private String email;
	private String phoneNumber;
	private String thumbnailImage;

	private Status status;

	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;


	private List<EquipmentEntity> equipments;
	private List<ConstructionEntity> constructions;

	private List<FeedbackEntity> sentFeedback;
	private List<FeedbackEntity> receivedFeedback;

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

	@Basic
	@Column(name = "thumbnail_image", nullable = true, length = 255)
	public String getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(String thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
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

	// TODO: 2/27/19 orphan removal here
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
	public List<FeedbackEntity> getSentFeedback() {
		return sentFeedback;
	}

	public void setSentFeedback(List<FeedbackEntity> sentFeedback) {
		this.sentFeedback = sentFeedback;
	}

	@JsonbTransient
	@XmlTransient
	@OneToMany(mappedBy = "toContractor", fetch = FetchType.LAZY, cascade = {})
	@Where(clause = "is_deleted = 0")
	public List<FeedbackEntity> getReceivedFeedback() {
		return receivedFeedback;
	}

	public void setReceivedFeedback(List<FeedbackEntity> receivedFeedback) {
		this.receivedFeedback = receivedFeedback;
	}


	public void setConstructions(List<ConstructionEntity> constructions) {
		this.constructions = constructions;
	}


	@JsonbTransient
	@Transient
	public boolean isActivated() {
		return status == Status.ACTIVATED;
	}

	public enum Status{
		NOT_VERIFIED,
		ACTIVATED,
		DEACTIVATED
	}
}
