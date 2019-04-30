package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
import com.ccp.webadmin.repositories.MaterialTypeRepository;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.MaterialTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialTypeServiceImpl implements MaterialTypeService {

    private final MaterialTypeRepository materialTypeRepository;

    @Autowired
    public MaterialTypeServiceImpl(MaterialTypeRepository materialTypeRepository) {
        this.materialTypeRepository = materialTypeRepository;
    }

    @Override
    public List<MaterialTypeEntity> findAll() {
        return materialTypeRepository.findAllNotDeleted();
    }

    @Override
    public List<MaterialTypeEntity> findByGeneralMaterialType(GeneralMaterialTypeEntity generalMaterialTypeEntity) {
        return materialTypeRepository.findAllByGeneralMaterialTypeEntity(generalMaterialTypeEntity);
    }

    @Override
    public MaterialTypeEntity findById(Integer id) {
        return materialTypeRepository.findById(id).get();
    }

    @Override
    public void save(MaterialTypeEntity materialTypeEntity) {
        materialTypeRepository.save(materialTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        materialTypeRepository.deleteById(id);
    }
}
