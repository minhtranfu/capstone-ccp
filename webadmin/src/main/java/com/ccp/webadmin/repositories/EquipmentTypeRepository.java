package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface EquipmentTypeRepository extends JpaRepository<EquipmentTypeEntity, Integer> {

    @Query("Select e from EquipmentTypeEntity e where e.isDeleted = false")
    List<EquipmentTypeEntity> findAllNotDeleted();

    List<EquipmentTypeEntity> findAllByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);

    boolean existsEquipmentTypeEntitiesByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);
}
