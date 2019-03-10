package listeners.entityListenters;

import daos.ConstructionDAO;
import entities.ConstructionEntity;
import entities.EquipmentEntity;

import javax.inject.Inject;
import javax.inject.Singleton;
import javax.persistence.PostLoad;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;

public class EquipmentEntityListener {

	@Inject
	ConstructionDAO constructionDAO;

	private void updateLoactionDataBasedOnConstruction(EquipmentEntity equipmentEntity) {
		ConstructionEntity construction = equipmentEntity.getConstruction();
		if (construction == null) {
			return;
		}

		ConstructionEntity managedConstruction = constructionDAO.findByID(construction.getId());
		equipmentEntity.setAddress(construction.getAddress());
		equipmentEntity.setLongitude(construction.getLongitude());
		equipmentEntity.setLatitude(construction.getLatitude());
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

}
