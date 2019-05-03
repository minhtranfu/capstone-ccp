package entities;

import org.hibernate.annotations.Where;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.json.bind.annotation.JsonbTransient;
import javax.xml.bind.annotation.XmlTransient;
import java.util.Objects;

@Entity
@Table(name = "additional_specs_field", schema = "capstone_ccp")
public class AdditionalSpecsFieldEntity {
	private long id;
	private String name;
	private DataType dataType;
	private EquipmentTypeEntity equipmentType;
	private double priceWeight;
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
	@Enumerated(EnumType.STRING)
	@Column(name = "data_type", nullable = true, length = 255)
	public DataType getDataType() {
		return dataType;
	}

	public void setDataType(DataType dataType) {
		this.dataType = dataType;
	}

	@Basic
	@Column(name = "price_weight")
	public double getPriceWeight() {
		return priceWeight;
	}

	public void setPriceWeight(double priceWeight) {
		this.priceWeight = priceWeight;
	}



	@JsonbTransient
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
	@Column(name = "is_deleted", insertable = false)
	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	@Override
	public String toString() {
		return "AdditionalSpecsFieldEntity{" +
				"id=" + id +
				", name='" + name + '\'' +
				", dataType=" + dataType +
				'}';
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (!(o instanceof AdditionalSpecsFieldEntity)) return false;
		AdditionalSpecsFieldEntity that = (AdditionalSpecsFieldEntity) o;
		return id == that.id;
	}

	@Override
	public int hashCode() {
		return Objects.hash(id);
	}

	public enum DataType {
		STRING,
		INTEGER,
		DOUBLE;


		public boolean isNumbericType() {
			return this == DOUBLE || this == INTEGER;
		}
	}

}
