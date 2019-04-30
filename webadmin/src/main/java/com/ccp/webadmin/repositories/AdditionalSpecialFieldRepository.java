package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AdditionalSpecialFieldRepository extends JpaRepository<AdditionalSpecialFieldEntity, Integer>
{
    @Query("Select e from AdditionalSpecialFieldEntity e where e.isDeleted = false")
    List<AdditionalSpecialFieldEntity> findAllNotDeleted();

    List<AdditionalSpecialFieldEntity> findAllByEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity);

    boolean existsAdditionalSpecialFieldEntityByEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity);
}
