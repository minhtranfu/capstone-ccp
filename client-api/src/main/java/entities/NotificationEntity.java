package entities;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "notification", schema = "capstone_ccp", catalog = "")
public class NotificationEntity {
	private long id;
	private String title;
	private String content;
	private Timestamp createdTime;
	private Boolean isRead;
	private Integer constructorId;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "title", nullable = true, length = 255)
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	@Basic
	@Column(name = "content", nullable = true, length = 2000)
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
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
	@Column(name = "is_read", nullable = true)
	public Boolean getRead() {
		return isRead;
	}

	public void setRead(Boolean read) {
		isRead = read;
	}

	@Basic
	@Column(name = "constructor_id", nullable = true)
	public Integer getConstructorId() {
		return constructorId;
	}

	public void setConstructorId(Integer constructorId) {
		this.constructorId = constructorId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		NotificationEntity that = (NotificationEntity) o;

		if (id != that.id) return false;
		if (title != null ? !title.equals(that.title) : that.title != null) return false;
		if (content != null ? !content.equals(that.content) : that.content != null) return false;
		if (createdTime != null ? !createdTime.equals(that.createdTime) : that.createdTime != null) return false;
		if (isRead != null ? !isRead.equals(that.isRead) : that.isRead != null) return false;
		if (constructorId != null ? !constructorId.equals(that.constructorId) : that.constructorId != null)
			return false;

		return true;
	}

}
