package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.repositories.AdminUserRepository;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GeneralEquipmentTypeImpl implements GeneralEquipmentTypeService {

    private final GeneralEquipmentTypeRepository generalEquipmentTypeRepository;

    @Autowired

    public GeneralEquipmentTypeImpl(GeneralEquipmentTypeRepository generalEquipmentTypeRepository) {
        this.generalEquipmentTypeRepository = generalEquipmentTypeRepository;
    }

    @Override
    public List<GeneralEquipmentTypeEntity> findAll() {
        return generalEquipmentTypeRepository.findAll();
    }

    @Override
    public GeneralEquipmentTypeEntity findGeneralEquipmentTypeById(Integer id) {
        return generalEquipmentTypeRepository.findById(id).get();
    }

    @Override
    public void save(GeneralEquipmentTypeEntity generalEquipmentTypeEntity) {
        generalEquipmentTypeRepository.save(generalEquipmentTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        generalEquipmentTypeRepository.deleteById(id);
    }
}
