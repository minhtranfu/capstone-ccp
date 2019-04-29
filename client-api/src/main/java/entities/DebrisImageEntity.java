package entities;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "debris_image", schema = "capstone_ccp")
public class DebrisImageEntity {
	private long id;
	private String url;

	private DebrisPostEntity debrisPost;

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
	@Column(name = "url", nullable = false, length = 1000)
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}


	@ManyToOne(fetch = FetchType.EAGER)
	@JsonbTransient
	@JoinColumn(name = "debris_post_id", nullable = true)
	public DebrisPostEntity getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(DebrisPostEntity debrisPost) {
		this.debrisPost = debrisPost;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		DebrisImageEntity that = (DebrisImageEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
