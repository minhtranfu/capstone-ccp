package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GeneralMaterialTypeRepository extends JpaRepository<GeneralMaterialTypeEntity, Integer>
{
    @Query("Select e from GeneralMaterialTypeEntity e where e.isDeleted = false")
    List<GeneralMaterialTypeEntity> findAllNotDeleted();

    boolean existsByName(String name);
}
