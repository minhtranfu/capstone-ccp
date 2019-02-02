package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdditionalSpecialFieldRepository extends JpaRepository<AdditionalSpecialFieldEntity, Integer>
{

    List<AdditionalSpecialFieldEntity> findAllByEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity);

    boolean existsAdditionalSpecialFieldEntityByEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity);
}
