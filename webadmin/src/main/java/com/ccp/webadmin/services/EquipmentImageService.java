package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EquipmentImageService {

    List<EquipmentImageEntity> findAll();

    List<EquipmentImageEntity> findByEquipmentEntity(EquipmentEntity equipmentEntity);
}
