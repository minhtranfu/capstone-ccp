package entities;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "debris_image", schema = "capstone_ccp")
public class DebrisImageEntity {
	private long id;
	private String url;
	private Integer debrisPostId;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "url", nullable = false, length = 1000)
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	@Basic
	@Column(name = "debris_post_id", nullable = true)
	public Integer getDebrisPostId() {
		return debrisPostId;
	}

	public void setDebrisPostId(Integer debrisPostId) {
		this.debrisPostId = debrisPostId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisImageEntity that = (DebrisImageEntity) o;
		return id == that.id &&
				Objects.equals(url, that.url) &&
				Objects.equals(debrisPostId, that.debrisPostId);
	}

	@Override
	public int hashCode() {
		return Objects.hash(id, url, debrisPostId);
	}
}
