package entities;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import java.util.Objects;

@Entity
//@Where(clause = "is_deleted=0")
@Table(name = "equipment_image", schema = "capstone_ccp", catalog = "")
public class EquipmentImageEntity {
	private long id;
	private String url;
	private EquipmentEntity equipment;

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
	@Column(name = "url", nullable = true, length = 255)
	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}


	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "equipment_id", referencedColumnName = "id")
	@JsonbTransient
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof EquipmentImageEntity)) return false;
		EquipmentImageEntity that = (EquipmentImageEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}
}
