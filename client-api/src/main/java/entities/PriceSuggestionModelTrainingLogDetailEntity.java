package entities;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "price_suggestion_model_training_log_detail", schema = "capstone_ccp", catalog = "")
public class PriceSuggestionModelTrainingLogDetailEntity {
	private long id;
	private double weight;
	private PriceSuggestionModelTrainingLogEntity priceSuggestionModelTrainingLogEntity;
	private Long additionalSpecsFieldId;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;

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
	@Column(name = "weight", nullable = false, precision = 0)
	public double getWeight() {
		return weight;
	}

	public void setWeight(double weight) {
		this.weight = weight;
	}


	@Basic
	@Column(name = "additional_specs_field_id", nullable = false)
	public Long getAdditionalSpecsFieldId() {
		return additionalSpecsFieldId;
	}

	public void setAdditionalSpecsFieldId(Long addtionalSpecsFieldId) {
		this.additionalSpecsFieldId = addtionalSpecsFieldId;
	}

	@Basic
	@Column(name = "created_time", nullable = false, insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = false, insertable = false, updatable = false)
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
		PriceSuggestionModelTrainingLogDetailEntity that = (PriceSuggestionModelTrainingLogDetailEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@ManyToOne
	@JoinColumn(name = "price_suggestion_model_training_log_id", referencedColumnName = "id", nullable = false)
	public PriceSuggestionModelTrainingLogEntity getPriceSuggestionModelTrainingLogEntity() {
		return priceSuggestionModelTrainingLogEntity;
	}

	public void setPriceSuggestionModelTrainingLogEntity(PriceSuggestionModelTrainingLogEntity priceSuggestionModelTrainingLogEntity) {
		this.priceSuggestionModelTrainingLogEntity = priceSuggestionModelTrainingLogEntity;
	}


}
