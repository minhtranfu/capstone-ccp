package entities;

import org.hibernate.annotations.CollectionId;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.time.LocalDateTime;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "material", schema = "capstone_ccp")
public class MaterialEntity {
	private long id;

	@NotNull
	private String name;
	@Positive
	private double price;


	@NotNull
	@NotEmpty
	private String thumbnailImageUrl;

	@NotNull
	private String manufacturer;
	private String description;

	private boolean isHidden;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;

	@NotNull
	private MaterialTypeEntity materialType;

	@NotNull
	private ContractorEntity contractor;
	@NotNull
	private ConstructionEntity construction;

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
	@Column(name = "name", nullable = false)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "price", nullable = false, precision = 0)
	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}





	@Basic
	@Column(name = "manufacturer", nullable = true, length = 256)
	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
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
	@Column(name = "is_hidden", nullable = false)
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
	@Column(name = "is_deleted", nullable = true, insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {

		isDeleted = deleted;
	}

	@Basic
	@Column(name = "thumbnail_image_url")
	public String getThumbnailImageUrl() {
		return thumbnailImageUrl;
	}


	public void setThumbnailImageUrl(String thumbnailImageUrl) {
		this.thumbnailImageUrl = thumbnailImageUrl;
	}

	@ManyToOne
	@JoinColumn(name = "material_type_id")
	public MaterialTypeEntity getMaterialType() {
		return materialType;
	}

	public void setMaterialType(MaterialTypeEntity materialType) {

		this.materialType = materialType;
	}

	@ManyToOne
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}


	@ManyToOne
	@JoinColumn(name = "construction_id")
	public ConstructionEntity getConstruction() {
		return construction;
	}

	public void setConstruction(ConstructionEntity constructionEntity) {
		this.construction = constructionEntity;
	}
}
