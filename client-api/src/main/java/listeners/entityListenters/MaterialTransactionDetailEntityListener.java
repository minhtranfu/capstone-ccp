package listeners.entityListenters;

import daos.MaterialDAO;
import entities.MaterialEntity;
import entities.MaterialTransactionDetailEntity;

import javax.inject.Inject;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

public class MaterialTransactionDetailEntityListener {
	@Inject
	MaterialDAO materialDAO;

	@PrePersist
	void prePersist(MaterialTransactionDetailEntity entity) {
		//only do this in persist, not update
		// 3/25/19 set material address
		MaterialEntity foundMaterial = materialDAO.findByIdWithValidation(entity.getMaterial().getId());
		entity.setMaterialAddress(foundMaterial.getConstruction().getAddress());
		entity.setMaterialLat(foundMaterial.getConstruction().getLatitude());
		entity.setMaterialLong(foundMaterial.getConstruction().getLongitude());

		// 3/25/19 set material unit
		entity.setUnit(foundMaterial.getMaterialType().getUnit());

	}

	@PreUpdate
	void preUpdate(MaterialTransactionDetailEntity entity) {

	}
}
