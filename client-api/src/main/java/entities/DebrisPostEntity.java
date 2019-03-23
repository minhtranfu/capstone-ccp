package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Where(clause = "is_deleted = 0")
@Table(name = "debris_post", schema = "capstone_ccp")
@NamedQuery(name = "DebrisPostEntity.byRequester", query = "select e from DebrisPostEntity e where e.requester.id = :requesterId")
public class DebrisPostEntity {
	private long id;
	@NotNull
	@NotBlank
	private String title;

	@NotNull
	@NotBlank
	private String address;


	private DebrisImageEntity thumbnailImage;

	@Max(180)
	@Min(-180)
	private double longitude;

	@Max(90)
	@Min(-90)
	private double latitude;
	private String description;
	private Status status;

	@NotNull
	private ContractorEntity requester;
	private boolean isHidden;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;
	private List<DebrisBidEntity> debrisBids;
	private List<DebrisServiceTypeEntity> debrisServiceTypes;
	private List<DebrisTransactionEntity> debrisTransactions;
	private List<DebrisImageEntity> debrisImages;

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
	@Column(name = "title", nullable = false, length = 256)
	public String getTitle() {
		return title;
	}

	public void setTitle(String name) {
		this.title = name;
	}

	@OneToOne
	@JoinColumn(name = "thumbnail_image_id", referencedColumnName = "id")
	public DebrisImageEntity getThumbnailImage() {
		return thumbnailImage;
	}

	public void setThumbnailImage(DebrisImageEntity thumbnailImage) {
		this.thumbnailImage = thumbnailImage;
	}

	@OneToMany(mappedBy = "debrisPost",cascade = {},orphanRemoval = false)
	public List<DebrisImageEntity> getDebrisImages() {
		return debrisImages;
	}

	public void setDebrisImages(List<DebrisImageEntity> debrisImages) {
		this.debrisImages = debrisImages;
	}

	public void addDebrisImage(DebrisImageEntity debrisImageEntity) {
		this.debrisImages.add(debrisImageEntity);
		debrisImageEntity.setDebrisPost(this);
	}

	public void removeDebrisImage(DebrisImageEntity debrisImageEntity) {
		this.debrisImages.remove(debrisImageEntity);
		debrisImageEntity.setDebrisPost(null);
	}

	public void deleteAllDebrisImage() {

		for (DebrisImageEntity debrisImage : debrisImages) {
			debrisImage.setDebrisPost(null);
		}
		this.debrisImages.clear();
	}

	@Basic
	@Column(name = "address", nullable = true, length = 256)
	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Basic
	@Column(name = "longitude", nullable = false, precision = 0)
	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	@Basic
	@Column(name = "latitude", nullable = false, precision = 0)
	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	@Basic
	@Column(name = "description", nullable = true, length = -1)
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Basic
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = true, insertable = false)
	public Status getStatus() {
		return status;
	}

	public void setStatus(Status status) {
		this.status = status;
	}

	@Basic
	@Column(name = "is_hidden", nullable = true)
	public boolean isHidden() {
		return isHidden;
	}

	public void setHidden(boolean hidden) {
		isHidden = hidden;
	}

	@Basic
	@Column(name = "created_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = true, insertable = false, updatable = false)
	public LocalDateTime getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(LocalDateTime updatedTime) {

		this.updatedTime = updatedTime;
	}

	@Basic
	@Column(name = "is_deleted")
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}


	@ManyToOne
	@JoinColumn(name = "requester_id", referencedColumnName = "id")
	public ContractorEntity getRequester() {
		return requester;
	}

	public void setRequester(ContractorEntity requester) {
		this.requester = requester;
	}

	@OneToMany(mappedBy = "debrisPost")
	public List<DebrisBidEntity> getDebrisBids() {
		return debrisBids;
	}

	public void setDebrisBids(List<DebrisBidEntity> debrisBidsById) {
		this.debrisBids = debrisBidsById;
	}

	@ManyToMany(cascade = {})
	@JoinTable(
			name = "debris_service_type_debris_post",
			joinColumns = @JoinColumn(name = "debris_post_id"),
			inverseJoinColumns = @JoinColumn(name = "debris_service_type_id")
	)
	public List<DebrisServiceTypeEntity> getDebrisServiceTypes() {
		return debrisServiceTypes;
	}

	public void setDebrisServiceTypes(List<DebrisServiceTypeEntity> debrisServiceTypeDebrisPostsById) {
		this.debrisServiceTypes = debrisServiceTypeDebrisPostsById;
	}

	@JsonbTransient
	@OneToMany(mappedBy = "debrisPost")
	public List<DebrisTransactionEntity> getDebrisTransactions() {
		return debrisTransactions;
	}

	public void setDebrisTransactions(List<DebrisTransactionEntity> debrisTransactionsById) {
		this.debrisTransactions = debrisTransactionsById;
	}


	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof DebrisPostEntity)) return false;
		DebrisPostEntity that = (DebrisPostEntity) o;
		return id == that.id;
	}

	@Override
	public String toString() {
		return "DebrisPostEntity{" +
				"id=" + id +
				", debrisServiceTypes=" + debrisServiceTypes +
				'}';
	}

	public enum Status {
		PENDING,
		ACCEPTED,
		FINISHED,
		CLOSED
	}
}
