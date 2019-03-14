package listeners.entityListenters;

import daos.ConstructionDAO;
import daos.EquipmentDAO;
import entities.ConstructionEntity;
import entities.EquipmentEntity;
import listeners.events.EquipmentDataChangedEvent;

import javax.enterprise.event.Event;
import javax.inject.Inject;
import javax.inject.Singleton;
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
		equipmentEntity.setAddress(managedConstruction.getAddress());
		equipmentEntity.setLongitude(managedConstruction.getLongitude());
		equipmentEntity.setLatitude(managedConstruction.getLatitude());
	}


	@PrePersist
	void prePersist(EquipmentEntity equipmentEntity) {
		// TODO: 3/10/19 set locaiton data based on construction
		updateLoactionDataBasedOnConstruction(equipmentEntity);
	}

	@PreUpdate
	void preUpdate(EquipmentEntity equipmentEntity) {
		// TODO: 3/10/19 set locaiton data based on construction
		updateLoactionDataBasedOnConstruction(equipmentEntity);
	}

	@PreRemove
	void preRemove(EquipmentEntity equipmentEntity) {
	}

	@PostUpdate
	void postUpdate(EquipmentEntity equipmentEntity) {
		notifyEquipmentChanged(equipmentEntity);
	}

	@PostPersist
	void postPersist(EquipmentEntity equipmentEntity) {
		notifyEquipmentChanged(equipmentDAO.findByID(equipmentEntity.getId()));
	}
}
