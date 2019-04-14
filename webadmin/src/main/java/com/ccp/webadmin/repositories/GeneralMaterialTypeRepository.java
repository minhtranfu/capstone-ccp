package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GeneralMaterialTypeRepository extends JpaRepository<GeneralMaterialTypeEntity, Integer>
{
}
