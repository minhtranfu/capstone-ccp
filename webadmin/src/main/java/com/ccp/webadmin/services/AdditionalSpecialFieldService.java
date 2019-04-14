package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface AdditionalSpecialFieldService {
    boolean existsAdditionalSpecialFieldByEquipmentType(EquipmentTypeEntity equipmentTypeEntity);

    List<AdditionalSpecialFieldEntity> findAll();

    List<AdditionalSpecialFieldEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity);

    AdditionalSpecialFieldEntity findById(Integer id);

    void save(AdditionalSpecialFieldEntity additionalSpecialFieldEntity);

    void deleteById(Integer id);

}
