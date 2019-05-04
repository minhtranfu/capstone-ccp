package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MaterialTypeService {
    List<MaterialTypeEntity> findAll();

    List<MaterialTypeEntity> findByGeneralMaterialType(GeneralMaterialTypeEntity generalMaterialTypeEntity);

    MaterialTypeEntity findById(Integer id);

    void save(MaterialTypeEntity materialTypeEntity);

    boolean existsByName(String name);

    void deleteById(Integer id);

}
