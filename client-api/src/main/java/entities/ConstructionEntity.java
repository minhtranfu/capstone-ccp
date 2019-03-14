package entities;

import listeners.entityListenters.ConstructionEntityListener;
import org.hibernate.annotations.Where;
import org.hibernate.annotations.WhereJoinTable;

import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.validation.constraints.*;
import javax.xml.bind.annotation.XmlTransient;
import java.util.List;

@Entity
@Table(name = "construction", schema = "capstone_ccp")
@Where(clause = "is_deleted = 0")
@EntityListeners(ConstructionEntityListener.class)
public class ConstructionEntity {
	private long id;

	@NotNull
	@NotEmpty
	private String name;

	@NotNull
	@NotEmpty
	private String address;

	@NotNull
	private double longitude;

	@NotNull
	private double latitude;

	private boolean isDeleted;
	private ContractorEntity contractor;


	private List<EquipmentEntity> equipmentEntities;


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
	@Column(name = "address", nullable = true, length = 255)
	public String getAddress() {
		return address;
	}


	public void setAddress(String address) {
		this.address = address;
	}


	@Basic
	@Column(name = "`long`")
	@NotNull
	@Min(-180)
	@Max(180)
	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	@Basic
	@Column(name = "lat")
	@NotNull
	@Min(-90)
	@Max(90)
	public double getLatitude() {
		return latitude;
	}

	public void setLatitude(double latitude) {
		this.latitude = latitude;
	}

	@Basic
	@Column(name = "is_deleted", insertable=false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@JsonbTransient
	@XmlTransient
	@ManyToOne()
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractorEntity) {
		this.contractor = contractorEntity;

	}

	@OneToMany(mappedBy = "construction", cascade = CascadeType.MERGE)
	@JsonbTransient
	@XmlTransient
	public List<EquipmentEntity> getEquipmentEntities() {
		return equipmentEntities;
	}

	public void setEquipmentEntities(List<EquipmentEntity> equipmentEntities) {
		this.equipmentEntities = equipmentEntities;
	}
}

