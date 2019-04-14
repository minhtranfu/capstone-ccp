package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.repositories.GeneralMaterialTypeRepository;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import com.ccp.webadmin.services.GeneralMaterialTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeneralMaterialTypeServiceImpl implements GeneralMaterialTypeService {

    private final GeneralMaterialTypeRepository generalMaterialTypeRepository;

    @Autowired
    public GeneralMaterialTypeServiceImpl(GeneralMaterialTypeRepository generalMaterialTypeRepository) {
        this.generalMaterialTypeRepository = generalMaterialTypeRepository;
    }

    @Override
    public List<GeneralMaterialTypeEntity> findAll() {
        return generalMaterialTypeRepository.findAll();
    }

    @Override
    public GeneralMaterialTypeEntity findById(Integer id) {
        return generalMaterialTypeRepository.findById(id).get();
    }

    @Override
    public void save(GeneralMaterialTypeEntity generalMaterialTypeEntity) {
        generalMaterialTypeRepository.save(generalMaterialTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        generalMaterialTypeRepository.deleteById(id);
    }
}
