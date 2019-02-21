package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.sql.Timestamp;


@Entity
@Where(clause = "is_deleted=0")
@NamedQueries({
		@NamedQuery(name = "FeedbackEntity.getByToContractorId", query = "select  e from FeedbackEntity  e where e.toContractor.id = :toContractorId")
		, @NamedQuery(name = "FeedbackEntity.getByFromContractorId", query = "select  e from FeedbackEntity  e where e.fromContractor.id =:fromContractorId")
		, @NamedQuery(name = "FeedbackEntity.getBy", query = "select  e from FeedbackEntity  e where e.fromContractor.id =:fromContractorId and e.toContractor.id=:toContractorId")
})

@Table(name = "feedback", schema = "capstone_ccp", catalog = "")
public class FeedbackEntity {
	private long id;
	private String content;
	private Boolean isRead;
	private Timestamp createdTime;
	private Timestamp updatedTime;
	private ContractorEntity toContractor;
	private ContractorEntity fromContractor;
	private FeedbackTypeEntity feedbackType;


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
	@Column(name = "content", nullable = true, length = 1000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Basic
	@Column(name = "is_read", nullable = true)
	public Boolean getRead() {
		return isRead;
	}

	public void setRead(Boolean read) {
		isRead = read;
	}

	@Basic
	@Column(name = "created_time", insertable = false, updatable = false)
	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}


	@ManyToOne
	@JoinColumn(name = "to_contractor_id")
	public ContractorEntity getToContractor() {
		return toContractor;
	}

	public void setToContractor(ContractorEntity toContractor) {
		this.toContractor = toContractor;
	}

	@ManyToOne
	@JoinColumn(name = "from_contractor_id")
	public ContractorEntity getFromContractor() {
		return fromContractor;
	}

	public void setFromContractor(ContractorEntity fromContractor) {
		this.fromContractor = fromContractor;
	}

	@ManyToOne
	@JoinColumn(name = "feedback_type_id")
	public FeedbackTypeEntity getFeedbackType() {
		return feedbackType;
	}

	public void setFeedbackType(FeedbackTypeEntity feedbackType) {
		this.feedbackType = feedbackType;
	}

	@Basic
	@Column(name = "updated_time", nullable = true, insertable = false, updatable = false)
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}
}
