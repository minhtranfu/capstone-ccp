package entities;

import org.hibernate.annotations.Where;
import org.hibernate.annotations.WhereJoinTable;

import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;

@Entity
@Table(name = "construction", schema = "capstone_ccp")
@Where(clause = "is_deleted = 0")
public class ConstructionEntity {
	private long id;
	private String name;
	private String address;
	private double longitude;
	private double latitude;
	private boolean isDeleted;
	private ContractorEntity contractor;


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
	public double getLongitude() {
		return longitude;
	}

	public void setLongitude(double longitude) {
		this.longitude = longitude;
	}

	@Basic
	@Column(name = "lat")
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
	@ManyToOne()
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractorEntity) {
		this.contractor = contractorEntity;
	}
}

