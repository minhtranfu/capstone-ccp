package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.ws.rs.GET;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification", schema = "capstone_ccp")
@NamedQuery(name = "NotificationEntity.getByContractorId", query = "select e from NotificationEntity e where e.contractor.id =:contractorId order by e.createdTime desc ")
public class NotificationEntity {
	private long id;
	private String title;
	private String content;
	private LocalDateTime createdTime;
	private boolean isRead;
	private ContractorEntity contractor;
	private String clickAction;


	public NotificationEntity() {
	}

	public NotificationEntity(String title, String content, ContractorEntity contractor, String clickAction) {
		this.title = title;
		this.content = content;
		this.contractor = contractor;
		this.clickAction = clickAction;
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
	@Column(name = "created_time", insertable = false, updatable = false)
	public LocalDateTime getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(LocalDateTime createdTime) {
		this.createdTime = createdTime;
	}


	@Basic
	@Column(name = "is_read", nullable = true)
	public boolean isRead() {
		return isRead;
	}

	public void setRead(boolean read) {
		isRead = read;
	}

	@ManyToOne
	@JsonbTransient
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {

		this.contractor = contractor;
	}

	@Basic
	@Column(name = "click_action")
	public String getClickAction() {
		return clickAction;
	}

	public void setClickAction(String clickAction) {
		this.clickAction = clickAction;
	}
}
