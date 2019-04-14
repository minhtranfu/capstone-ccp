package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.repositories.HiringTransactionRepository;
import com.ccp.webadmin.repositories.NotificationDeviceTokenRepository;
import com.ccp.webadmin.services.HiringTransactionService;
import com.ccp.webadmin.services.NotificationDeviceTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationDeviceTokenServiceImpl implements NotificationDeviceTokenService {

    private final NotificationDeviceTokenRepository notificationDeviceTokenRepository;

    @Autowired
    public NotificationDeviceTokenServiceImpl(NotificationDeviceTokenRepository notificationDeviceTokenRepository) {
        this.notificationDeviceTokenRepository = notificationDeviceTokenRepository;
    }


    @Override
    public List<NotificationDeviceTokenEntity> findAll() {
        return notificationDeviceTokenRepository.findAll();
    }

    @Override
    public List<NotificationDeviceTokenEntity> findByContractor(ContractorEntity contractorEntity) {
        return notificationDeviceTokenRepository.findAllByContractorEntity(contractorEntity);
    }

}
