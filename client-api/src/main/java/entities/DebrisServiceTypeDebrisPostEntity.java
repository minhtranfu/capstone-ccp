package entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "debris_service_type_debris_post", schema = "capstone_ccp", catalog = "")
public class DebrisServiceTypeDebrisPostEntity {
	private long id;
	private DebrisServiceTypeEntity debrisServiceType;
	private DebrisPostEntity debrisPost;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisServiceTypeDebrisPostEntity that = (DebrisServiceTypeDebrisPostEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	@ManyToOne
	@JoinColumn(name = "debris_service_type_id", referencedColumnName = "id")
	public DebrisServiceTypeEntity getDebrisServiceType() {
		return debrisServiceType;
	}

	public void setDebrisServiceType(DebrisServiceTypeEntity debrisServiceTypeByDebrisServiceTypeId) {
		this.debrisServiceType = debrisServiceTypeByDebrisServiceTypeId;
	}

	@ManyToOne
	@JoinColumn(name = "debris_post_id", referencedColumnName = "id")
	public DebrisPostEntity getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(DebrisPostEntity debrisPostByDebrisPostId) {
		this.debrisPost = debrisPostByDebrisPostId;
	}
}
