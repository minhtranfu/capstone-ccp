package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentImageEntity;
import com.ccp.webadmin.repositories.ContractorVerifyingImageRepository;
import com.ccp.webadmin.repositories.EquipmentImageRepository;
import com.ccp.webadmin.services.ContractorVerifyingImageService;
import com.ccp.webadmin.services.EquipmentImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentImageServiceImpl implements EquipmentImageService {

    private final EquipmentImageRepository equipmentImageRepository;

    @Autowired
    public EquipmentImageServiceImpl(EquipmentImageRepository equipmentImageRepository) {
        this.equipmentImageRepository = equipmentImageRepository;
    }


    @Override
    public List<EquipmentImageEntity> findAll() {
        return equipmentImageRepository.findAll();
    }

    @Override
    public List<EquipmentImageEntity> findByEquipmentEntity(EquipmentEntity equipmentEntity) {
        return equipmentImageRepository.findAllByEquipmentEntity(equipmentEntity);
    }
}
