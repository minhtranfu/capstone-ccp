package listeners.entityListenters;

import daos.ConstructionDAO;
import daos.EquipmentDAO;
import entities.ConstructionEntity;
import entities.EquipmentEntity;
import listeners.events.EquipmentDataChangedEvent;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.persistence.*;

public class EquipmentEntityListener {

	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	Event<EquipmentDataChangedEvent> equipmentStatusChangedEvent;

	@Inject
	ConstructionDAO constructionDAO;


	private void notifyEquipmentChanged(EquipmentEntity equipmentEntity) {

		System.out.println("EQUIPMENTDAO notifyEquipmentChanged");
		equipmentStatusChangedEvent.fire(new EquipmentDataChangedEvent(equipmentEntity));
	}

	private void updateLoactionDataBasedOnConstruction(EquipmentEntity equipmentEntity) {
		ConstructionEntity construction = equipmentEntity.getConstruction();
		if (construction == null) {
			return;
		}

		ConstructionEntity managedConstruction = constructionDAO.findByID(construction.getId());
	}


	@PrePersist
	void prePersist(EquipmentEntity equipmentEntity) {
		updateLoactionDataBasedOnConstruction(equipmentEntity);
	}

	@PreUpdate

	void preUpdate(EquipmentEntity equipmentEntity) {
		updateLoactionDataBasedOnConstruction(equipmentEntity);
	}

	@PreRemove
	void preRemove(EquipmentEntity equipmentEntity) {
	}

	@PostUpdate
	void postUpdate(EquipmentEntity equipmentEntity) {
		notifyEquipmentChanged(equipmentEntity);
		// TODO: 3/29/19 send notifications for realted sides


	}


	@PostPersist
	void postPersist(EquipmentEntity equipmentEntity) {
		notifyEquipmentChanged(equipmentDAO.findByID(equipmentEntity.getId()));
	}
}
