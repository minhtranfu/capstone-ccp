package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MaterialTypeRepository extends JpaRepository<MaterialTypeEntity, Integer>
{
    @Query("Select e from MaterialTypeEntity e where e.isDeleted = false")
    List<MaterialTypeEntity> findAllNotDeleted();

    List<MaterialTypeEntity> findAllByGeneralMaterialTypeEntity(GeneralMaterialTypeEntity generalMaterialTypeEntity);

    boolean existsEquipmentTypeEntitiesByGeneralMaterialTypeEntity(GeneralMaterialTypeEntity generalMaterialTypeEntity);
}
