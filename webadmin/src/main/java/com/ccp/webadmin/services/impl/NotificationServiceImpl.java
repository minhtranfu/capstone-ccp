package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import com.ccp.webadmin.entities.NotificationEntity;
import com.ccp.webadmin.repositories.MaterialTypeRepository;
import com.ccp.webadmin.repositories.NotificationRepository;
import com.ccp.webadmin.services.MaterialTypeService;
import com.ccp.webadmin.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public void save(NotificationEntity notificationEntity) {
        notificationRepository.save(notificationEntity);
    }
}
