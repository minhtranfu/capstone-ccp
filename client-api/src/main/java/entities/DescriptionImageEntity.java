package entities;

import javax.persistence.*;

@Entity
@Table(name = "description_image", schema = "capstone_ccp", catalog = "")
public class DescriptionImageEntity {
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


	@ManyToOne
	@JoinColumn(name = "equipment_id", referencedColumnName = "id")
	public EquipmentEntity getEquipment() {
		return equipment;
	}

	public void setEquipment(EquipmentEntity equipment) {
		this.equipment = equipment;
	}
}
