package com.ccp.webadmin.utils;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.entities.NotificationEntity;
import com.ccp.webadmin.services.NotificationDeviceTokenService;
import com.ccp.webadmin.services.NotificationService;
import com.google.auth.Credentials;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.*;
import org.joda.time.DateTime;
import org.joda.time.DateTimeZone;
import org.joda.time.format.DateTimeFormat;
import org.joda.time.format.DateTimeFormatter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.UUID;

@Service
public class SendNotificationForTransaction {

    private final PushNotifictionHelper pushNotifictionHelper;
    private final NotificationDeviceTokenService notificationDeviceTokenService;
    private final NotificationService notificationService;

    @Autowired
    public SendNotificationForTransaction(PushNotifictionHelper pushNotifictionHelper, NotificationDeviceTokenService notificationDeviceTokenService, NotificationService notificationService) {
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
        this.notificationService = notificationService;
    }


    public void sendNotificationForTransaction(String title, String content, String clickAction, ContractorEntity supplier, ContractorEntity requester) {
        try {
            //send notification to supplier
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(supplier)
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content, clickAction);
            }

            // send notification to requester
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(requester)
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content, clickAction);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        saveNotification(title, content, clickAction, supplier, requester);
    }

    private void saveNotification(String title, String content, String clickAction, ContractorEntity supplier, ContractorEntity requester) {
        NotificationEntity notificationEntityforSupplier = new NotificationEntity(title, content, clickAction, supplier);
        NotificationEntity notificationEntityforRequester = new NotificationEntity(title, content, clickAction, requester);
        notificationService.save(notificationEntityforSupplier);
        notificationService.save(notificationEntityforRequester);
    }
}
