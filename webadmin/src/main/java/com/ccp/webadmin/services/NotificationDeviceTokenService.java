package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationDeviceTokenService {

    List<NotificationDeviceTokenEntity> findAll();

    List<NotificationDeviceTokenEntity> findByContractor(ContractorEntity contractorEntity);

}
