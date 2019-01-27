package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GeneralEquipmentTypeRepository extends JpaRepository<GeneralEquipmentTypeEntity, Integer>
{
}
