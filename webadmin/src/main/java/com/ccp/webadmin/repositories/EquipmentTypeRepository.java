package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentTypeRepository extends JpaRepository<EquipmentTypeEntity, Integer>
{
    List<EquipmentTypeEntity> findAllByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);

    boolean existsEquipmentTypeEntitiesByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);
}
