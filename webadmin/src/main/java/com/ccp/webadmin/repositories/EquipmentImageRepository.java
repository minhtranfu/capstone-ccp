package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentImageRepository extends JpaRepository<EquipmentImageEntity, Integer>
{
    List<EquipmentImageEntity> findAllByEquipmentEntity(EquipmentEntity equipmentEntity);
}
