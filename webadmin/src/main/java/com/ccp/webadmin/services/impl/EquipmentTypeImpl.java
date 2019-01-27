package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentTypeImpl implements EquipmentTypeService {

    private final EquipmentTypeRepository equipmentTypeRepository;

    @Autowired
    public EquipmentTypeImpl(EquipmentTypeRepository equipmentTypeRepository) {
        this.equipmentTypeRepository = equipmentTypeRepository;
    }

    @Override
    public boolean existsEquipmentTypeByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity) {
        return equipmentTypeRepository.existsEquipmentTypeEntitiesByGeneralEquipmentType(generalEquipmentTypeEntity);
    }

    @Override
    public List<EquipmentTypeEntity> findAll() {
        return equipmentTypeRepository.findAll();
    }

    @Override
    public List<EquipmentTypeEntity> findByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity) {
        return equipmentTypeRepository.findAllByGeneralEquipmentType(generalEquipmentTypeEntity);
    }

    @Override
    public EquipmentTypeEntity findEquipmentTypeById(Integer id) {
        return equipmentTypeRepository.findById(id).get();
    }

    @Override
    public void save(EquipmentTypeEntity equipmentTypeEntity) {
        equipmentTypeRepository.save(equipmentTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        equipmentTypeRepository.deleteById(id);
    }
}
