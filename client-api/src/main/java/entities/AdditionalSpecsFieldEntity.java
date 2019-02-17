package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.xml.bind.annotation.XmlTransient;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "additional_specs_field", schema = "capstone_ccp", catalog = "")
public class AdditionalSpecsFieldEntity {
	private long id;
	private String name;
	private DataType dataType;
	private EquipmentTypeEntity equipmentType;
	private boolean isDeleted;




	@Id @GeneratedValue
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
	@Enumerated(EnumType.STRING)
	@Column(name = "data_type", nullable = true, length = 255)
	public DataType getDataType() {
		return dataType;
	}

	public void setDataType(DataType dataType) {
		this.dataType = dataType;
	}


	@XmlTransient
	@ManyToOne
	@JoinColumn(name = "equipment_type_id")
	public EquipmentTypeEntity getEquipmentType() {
		return equipmentType;
	}

	public void setEquipmentType(EquipmentTypeEntity equipmentType) {
		this.equipmentType = equipmentType;
	}

	@Basic
	@Column(name = "is_deleted", insertable=false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}


	public enum DataType{
		STRING,
		INTEGER,
		DOUBLE
	}

}
