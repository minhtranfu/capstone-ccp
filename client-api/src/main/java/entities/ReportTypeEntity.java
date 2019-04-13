package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "report_type", schema = "capstone_ccp", catalog = "")
@NamedQuery(name = "FeedbackTypeEntity.getAll",query = "select e from ReportTypeEntity  e where e.deleted = false ")
public class ReportTypeEntity {
	private long id;
	private String name;

	private boolean isDeleted;
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
	@Column(name = "is_deleted", insertable=false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}
}
