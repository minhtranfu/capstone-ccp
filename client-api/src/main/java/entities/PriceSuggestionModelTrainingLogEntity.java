package entities;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "price_suggestion_model_training_log", schema = "capstone_ccp", catalog = "")
public class PriceSuggestionModelTrainingLogEntity {
	private long id;
	private LocalDate toDate;
	private LocalDate fromDate;
	private double testingRate;
	private long equipmentTypeId;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private List<PriceSuggestionModelTrainingLogDetailEntity> priceSuggestionModelTrainingLogDetailEntities = new ArrayList<>();

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
	@Column(name = "to_date", nullable = false)
	public LocalDate getToDate() {
		return toDate;
	}

	public void setToDate(LocalDate toDate) {
		this.toDate = toDate;
	}

	@Basic
	@Column(name = "from_date", nullable = false)
	public LocalDate getFromDate() {
		return fromDate;
	}

	public void setFromDate(LocalDate fromDate) {
		this.fromDate = fromDate;
	}

	@Basic
	@Column(name = "testing_rate", nullable = false, precision = 0)
	public double getTestingRate() {
		return testingRate;
	}

	public void setTestingRate(double testingRate) {
		this.testingRate = testingRate;
	}

	@Basic
	@Column(name = "equipment_type_id", nullable = false)
	public long getEquipmentTypeId() {
		return equipmentTypeId;
	}

	public void setEquipmentTypeId(long equipmentTypeId) {
		this.equipmentTypeId = equipmentTypeId;
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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		PriceSuggestionModelTrainingLogEntity that = (PriceSuggestionModelTrainingLogEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@OneToMany(mappedBy = "priceSuggestionModelTrainingLogEntity", cascade = CascadeType.ALL, orphanRemoval = true)
	public List<PriceSuggestionModelTrainingLogDetailEntity> getPriceSuggestionModelTrainingLogDetailEntities() {
		return priceSuggestionModelTrainingLogDetailEntities;
	}

	public void setPriceSuggestionModelTrainingLogDetailEntities(List<PriceSuggestionModelTrainingLogDetailEntity> priceSuggestionModelTrainingLogDetailEntities) {
		this.priceSuggestionModelTrainingLogDetailEntities = priceSuggestionModelTrainingLogDetailEntities;
	}

	public void addDetails(PriceSuggestionModelTrainingLogDetailEntity detailEntity) {
		priceSuggestionModelTrainingLogDetailEntities.add(detailEntity);
		detailEntity.setPriceSuggestionModelTrainingLogEntity(this);
	}

	public void removeDetails(PriceSuggestionModelTrainingLogDetailEntity detailEntity) {
		priceSuggestionModelTrainingLogDetailEntities.remove(detailEntity);
		detailEntity.setPriceSuggestionModelTrainingLogEntity(null);

	}
}
