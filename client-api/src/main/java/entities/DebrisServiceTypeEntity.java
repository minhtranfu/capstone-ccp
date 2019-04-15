package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "debris_service_type", schema = "capstone_ccp", catalog = "")
public class DebrisServiceTypeEntity {
	private long id;

	@NotNull
	@NotBlank
	private String name;
	private LocalDateTime createdTime;
	private LocalDateTime updatedTime;
	private boolean isDeleted;
	private List<DebrisPostEntity> debrisPosts;

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
	@Column(name = "name", nullable = false, length = 256)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "created_time", nullable = true , insertable = false, updatable = false)
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

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisServiceTypeEntity that = (DebrisServiceTypeEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, name, createdTime, updatedTime, isDeleted);
	}

	@JsonbTransient
	@ManyToMany(mappedBy = "debrisServiceTypes")
	public List<DebrisPostEntity> getDebrisPosts() {
		return debrisPosts;
	}

	public void setDebrisPosts(List<DebrisPostEntity> debrisPosts) {
		this.debrisPosts = debrisPosts;
	}


}
