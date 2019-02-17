package dtos.responses;

import entities.EquipmentTypeEntity;
import entities.GeneralEquipmentTypeEntity;

import java.util.List;

public class GeneralEquipmentTypeResponse extends GeneralEquipmentTypeEntity {


	public List<EquipmentTypeEntity> getEquipmentTypes() {
		return super.getEquipmentTypeEntities();
	}

	public GeneralEquipmentTypeResponse(GeneralEquipmentTypeEntity equipmentTypeEntity) {
		super(equipmentTypeEntity);
	}
}
