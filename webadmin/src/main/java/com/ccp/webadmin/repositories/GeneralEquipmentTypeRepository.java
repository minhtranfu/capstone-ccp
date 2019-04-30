package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface GeneralEquipmentTypeRepository extends JpaRepository<GeneralEquipmentTypeEntity, Integer>
{
    @Query("Select e from GeneralEquipmentTypeEntity e where e.isDeleted = false")
    List<GeneralEquipmentTypeEntity> findAllNotDeleted();

    boolean existsByName(String name);
}
