package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.AdditionalSpecialFieldRepository;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.services.AdditionalSpecialFieldService;
import com.ccp.webadmin.services.EquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdditionalSpeacialFieldServiceImpl implements AdditionalSpecialFieldService {

    private final EquipmentTypeRepository equipmentTypeRepository;
    private final AdditionalSpecialFieldRepository additionalSpecialFieldRepository;

    @Autowired
    public AdditionalSpeacialFieldServiceImpl(EquipmentTypeRepository equipmentTypeRepository, AdditionalSpecialFieldRepository additionalSpecialFieldRepository) {
        this.equipmentTypeRepository = equipmentTypeRepository;
        this.additionalSpecialFieldRepository = additionalSpecialFieldRepository;
    }

    @Override
    public boolean existsAdditionalSpecialFieldByEquipmentType(EquipmentTypeEntity equipmentTypeEntity) {
        return additionalSpecialFieldRepository.existsAdditionalSpecialFieldEntityByEquipmentTypeEntity(equipmentTypeEntity);
    }

    @Override
    public List<AdditionalSpecialFieldEntity> findAll() {
        return additionalSpecialFieldRepository.findAllNotDeleted();
    }

    @Override
    public List<AdditionalSpecialFieldEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity) {
        return additionalSpecialFieldRepository.findAllByEquipmentTypeEntity(equipmentTypeEntity);
    }

    @Override
    public AdditionalSpecialFieldEntity findById(Integer id) {
        return additionalSpecialFieldRepository.findById(id).get();
    }

    @Override
    public void save(AdditionalSpecialFieldEntity additionalSpecialFieldEntity) {
        additionalSpecialFieldRepository.save(additionalSpecialFieldEntity);
    }

    @Override
    public void deleteById(Integer id) {
        additionalSpecialFieldRepository.deleteById(id);
    }
}
