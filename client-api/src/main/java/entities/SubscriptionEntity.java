package entities;

import javax.persistence.*;

@Entity
@Table(name = "subscription", schema = "capstone_ccp", catalog = "")
public class SubscriptionEntity {
	private long id;
	private Integer equipmentTypeId;
	private Integer constructorId;
	private Boolean isSubscribed;

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
	@Column(name = "equipment_type_id", nullable = true)
	public Integer getEquipmentTypeId() {
		return equipmentTypeId;
	}

	public void setEquipmentTypeId(Integer equipmentTypeId) {
		this.equipmentTypeId = equipmentTypeId;
	}

	@Basic
	@Column(name = "constructor_id", nullable = true)
	public Integer getConstructorId() {
		return constructorId;
	}

	public void setConstructorId(Integer constructorId) {
		this.constructorId = constructorId;
	}

	@Basic
	@Column(name = "is_subscribed", nullable = true)
	public Boolean getSubscribed() {
		return isSubscribed;
	}

	public void setSubscribed(Boolean subscribed) {
		isSubscribed = subscribed;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		SubscriptionEntity that = (SubscriptionEntity) o;

		if (id != that.id) return false;
		if (equipmentTypeId != null ? !equipmentTypeId.equals(that.equipmentTypeId) : that.equipmentTypeId != null)
			return false;
		if (constructorId != null ? !constructorId.equals(that.constructorId) : that.constructorId != null)
			return false;
		if (isSubscribed != null ? !isSubscribed.equals(that.isSubscribed) : that.isSubscribed != null) return false;

		return true;
	}

}
