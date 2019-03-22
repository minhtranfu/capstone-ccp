package entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "debris_service_type_debris_post", schema = "capstone_ccp")
public class DebrisServiceTypeDebrisPostEntity {
	private long id;
	private long debrisServiceTypeId;
	private long debrisPostId;

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
	@Column(name = "debris_service_type_id", nullable = true)
	public long getDebrisServiceTypeId() {
		return debrisServiceTypeId;
	}

	public void setDebrisServiceTypeId(long debrisServiceTypeId) {
		this.debrisServiceTypeId = debrisServiceTypeId;
	}

	@Basic
	@Column(name = "debris_post_id", nullable = true)
	public long getDebrisPostId() {
		return debrisPostId;
	}

	public void setDebrisPostId(long debrisPostId) {
		this.debrisPostId = debrisPostId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisServiceTypeDebrisPostEntity that = (DebrisServiceTypeDebrisPostEntity) o;
		return id == that.id &&
				Objects.equals(debrisServiceTypeId, that.debrisServiceTypeId) &&
				Objects.equals(debrisPostId, that.debrisPostId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, debrisServiceTypeId, debrisPostId);
	}
}
