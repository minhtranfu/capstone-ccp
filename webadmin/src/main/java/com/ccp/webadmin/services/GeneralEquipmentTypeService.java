package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface GeneralEquipmentTypeService {
    List<GeneralEquipmentTypeEntity> findAll();

    GeneralEquipmentTypeEntity findGeneralEquipmentTypeById(Integer id);

    void save(GeneralEquipmentTypeEntity generalEquipmentTypeEntity);

    boolean existsByName(String name);

    void deleteById(Integer id);

}
