package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.DebrisImageEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface DebrisImageService {

    List<DebrisImageEntity> findAll();

    List<DebrisImageEntity> findByDebrisPostEntity(DebrisPostEntity debrisPostEntity);
}
