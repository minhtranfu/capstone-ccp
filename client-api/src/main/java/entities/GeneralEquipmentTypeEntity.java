package entities;

import javax.persistence.*;

@Entity
@Table(name = "general_equipment_type", schema = "capstone_ccp", catalog = "")
public class GeneralEquipmentTypeEntity {
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
	@Column(name = "is_deleted")
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}
}
