package entities;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "feedback", schema = "capstone_ccp", catalog = "")
public class FeedbackEntity {
	private long id;
	private String content;
	private Boolean isRead;
	private Timestamp createdTime;
	private Integer toConstructorId;
	private Integer fromConstructorId;
	private Integer feedbackTypeId;

	@Id
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
	@Column(name = "created_time", nullable = true)
	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
	@Column(name = "to_constructor_id", nullable = true)
	public Integer getToConstructorId() {
		return toConstructorId;
	}

	public void setToConstructorId(Integer toConstructorId) {
		this.toConstructorId = toConstructorId;
	}

	@Basic
	@Column(name = "from_constructor_id", nullable = true)
	public Integer getFromConstructorId() {
		return fromConstructorId;
	}

	public void setFromConstructorId(Integer fromConstructorId) {
		this.fromConstructorId = fromConstructorId;
	}

	@Basic
	@Column(name = "feedback_type_id", nullable = true)
	public Integer getFeedbackTypeId() {
		return feedbackTypeId;
	}

	public void setFeedbackTypeId(Integer feedbackTypeId) {
		this.feedbackTypeId = feedbackTypeId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		FeedbackEntity that = (FeedbackEntity) o;

		if (id != that.id) return false;
		if (content != null ? !content.equals(that.content) : that.content != null) return false;
		if (isRead != null ? !isRead.equals(that.isRead) : that.isRead != null) return false;
		if (createdTime != null ? !createdTime.equals(that.createdTime) : that.createdTime != null) return false;
		if (toConstructorId != null ? !toConstructorId.equals(that.toConstructorId) : that.toConstructorId != null)
			return false;
		if (fromConstructorId != null ? !fromConstructorId.equals(that.fromConstructorId) : that.fromConstructorId != null)
			return false;
		if (feedbackTypeId != null ? !feedbackTypeId.equals(that.feedbackTypeId) : that.feedbackTypeId != null)
			return false;

		return true;
	}

}
