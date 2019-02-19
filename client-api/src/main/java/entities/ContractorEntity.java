package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;
import java.sql.Timestamp;
import java.util.List;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "contractor", schema = "capstone_ccp")
public class ContractorEntity {
	private long id;
	private String name;
	private String email;
	private String phoneNumber;
	private String thumbnailImage;
	private boolean isActivated;

	private Timestamp createdTime;
	private Timestamp updatedTime;


	private List<EquipmentEntity> equipments;
	private List<ConstructionEntity> constructions;

	@XmlTransient
	@OneToMany(cascade =
			{CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH},
			orphanRemoval = false,
			mappedBy = "contractor")
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
	@Column(name = "is_activated", insertable = false, updatable = false)
	public boolean isActivated() {
		return isActivated;
	}

	public void setActivated(boolean activated) {
		isActivated = activated;
	}


	@Basic
	@Column(name = "created_time", insertable = false, updatable = false)
	public Timestamp getCreatedTime() {
		return createdTime;
	}


	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", insertable = false, updatable = false)
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}

	@OneToMany(mappedBy = "contractor",cascade = CascadeType.ALL, orphanRemoval = true)
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


	public void setConstructions(List<ConstructionEntity> constructions) {
		this.constructions = constructions;
	}
}
