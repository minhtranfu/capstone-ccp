package listeners.events;

import entities.EquipmentEntity;

public class EquipmentDataChangedEvent {
	private EquipmentEntity equipmentEntity;

	public EquipmentDataChangedEvent(EquipmentEntity equipmentEntity) {


		this.equipmentEntity = equipmentEntity;
	}

	public EquipmentEntity getEquipmentEntity() {
		return equipmentEntity;
	}

	public void setEquipmentEntity(EquipmentEntity equipmentEntity) {
		this.equipmentEntity = equipmentEntity;
	}
}
