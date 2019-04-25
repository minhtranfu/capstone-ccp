package entities;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "price_suggestion_model_training_log_detail", schema = "capstone_ccp", catalog = "")
public class PriceSuggestionModelTrainingLogDetailEntity {
	private long id;
	private double weight;
	private int priceSuggestionModelTrainingLogId;
	private long addtionalSpecsFieldId;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private PriceSuggestionModelTrainingLogEntity priceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId;

	@Id
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
	@Column(name = "price_suggestion_model_training_log_id", nullable = false)
	public int getPriceSuggestionModelTrainingLogId() {
		return priceSuggestionModelTrainingLogId;
	}

	public void setPriceSuggestionModelTrainingLogId(int priceSuggestionModelTrainingLogId) {
		this.priceSuggestionModelTrainingLogId = priceSuggestionModelTrainingLogId;
	}

	@Basic
	@Column(name = "addtional_specs_field_id", nullable = false)
	public long getAddtionalSpecsFieldId() {
		return addtionalSpecsFieldId;
	}

	public void setAddtionalSpecsFieldId(long addtionalSpecsFieldId) {
		this.addtionalSpecsFieldId = addtionalSpecsFieldId;
	}

	@Basic
	@Column(name = "created_time", nullable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "updated_time", nullable = false)
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
		return id == that.id &&
				Double.compare(that.weight, weight) == 0 &&
				priceSuggestionModelTrainingLogId == that.priceSuggestionModelTrainingLogId &&
				addtionalSpecsFieldId == that.addtionalSpecsFieldId &&
				Objects.equals(createdTime, that.createdTime) &&
				Objects.equals(updatedTime, that.updatedTime);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, weight, priceSuggestionModelTrainingLogId, addtionalSpecsFieldId, createdTime, updatedTime);
	}

	@ManyToOne
	@JoinColumn(name = "price_suggestion_model_training_log_id", referencedColumnName = "id", nullable = false)
	public PriceSuggestionModelTrainingLogEntity getPriceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId() {
		return priceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId;
	}

	public void setPriceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId(PriceSuggestionModelTrainingLogEntity priceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId) {
		this.priceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId = priceSuggestionModelTrainingLogByPriceSuggestionModelTrainingLogId;
	}
}
