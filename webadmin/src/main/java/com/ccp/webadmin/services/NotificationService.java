package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.NotificationEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface NotificationService {

    void save(NotificationEntity notificationEntity);

}
