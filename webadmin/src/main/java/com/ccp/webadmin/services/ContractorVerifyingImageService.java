package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContractorVerifyingImageService {

    List<ContractorVerifyingImageEntity> findAll();

    ContractorVerifyingImageEntity findById(Integer id);

    List<ContractorVerifyingImageEntity> findByContractor(ContractorEntity contractorEntity);

    void save(ContractorVerifyingImageEntity contractorVerifyingImageEntity);
}
