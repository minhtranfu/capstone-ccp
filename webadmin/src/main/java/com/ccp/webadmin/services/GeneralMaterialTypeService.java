package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GeneralMaterialTypeService {
    List<GeneralMaterialTypeEntity> findAll();

    GeneralMaterialTypeEntity findById(Integer id);

    void save(GeneralMaterialTypeEntity generalMaterialTypeEntity);

    boolean existsByName(String name);

    void deleteById(Integer id);

}
