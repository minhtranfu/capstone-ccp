package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialTypeRepository extends JpaRepository<MaterialTypeEntity, Integer>
{
    List<MaterialTypeEntity> findAllByGeneralMaterialTypeEntity(GeneralMaterialTypeEntity generalMaterialTypeEntity);

    boolean existsEquipmentTypeEntitiesByGeneralMaterialTypeEntity(GeneralMaterialTypeEntity generalMaterialTypeEntity);
}
