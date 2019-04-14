package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.DebrisImageEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DebrisImageRepository extends JpaRepository<DebrisImageEntity, Integer>
{
    List<DebrisImageEntity> findAllByDeBrisPostEntity(DebrisPostEntity debrisPostEntity);
}
