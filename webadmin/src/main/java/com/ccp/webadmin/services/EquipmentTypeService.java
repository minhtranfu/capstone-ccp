package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EquipmentTypeService {
    boolean existsEquipmentTypeByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);

    List<EquipmentTypeEntity> findAll();

    List<EquipmentTypeEntity> findByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);

    EquipmentTypeEntity findEquipmentTypeById(Integer id);

    void save(EquipmentTypeEntity equipmentTypeEntity);

    void deleteById(Integer id);

}
