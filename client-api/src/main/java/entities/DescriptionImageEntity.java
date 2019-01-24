package entities;

import javax.persistence.*;

@Entity
@Table(name = "description_image", schema = "capstone_ccp", catalog = "")
public class DescriptionImageEntity {
	private long id;
	private String url;
	private Integer equipmentId;
	private EquipmentEntity equipmentByEquipmentId;

	@Id
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

	@Basic
	@Column(name = "equipment_id", nullable = true, updatable = false, insertable = false)
	public Integer getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(Integer equipmentId) {
		this.equipmentId = equipmentId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		DescriptionImageEntity that = (DescriptionImageEntity) o;

		if (id != that.id) return false;
		if (url != null ? !url.equals(that.url) : that.url != null) return false;
		if (equipmentId != null ? !equipmentId.equals(that.equipmentId) : that.equipmentId != null) return false;

		return true;
	}


	@ManyToOne
	@JoinColumn(name = "equipment_id", referencedColumnName = "id")
	public EquipmentEntity getEquipmentByEquipmentId() {
		return equipmentByEquipmentId;
	}

	public void setEquipmentByEquipmentId(EquipmentEntity equipmentByEquipmentId) {
		this.equipmentByEquipmentId = equipmentByEquipmentId;
	}
}
