package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.entities.NotificationEntity;
import com.ccp.webadmin.services.ContractorService;
import com.ccp.webadmin.services.NotificationDeviceTokenService;
import com.ccp.webadmin.services.NotificationService;
import com.ccp.webadmin.utils.PushNotifictionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("notification")
public class NotificationController {

    private final PushNotifictionHelper pushNotifictionHelper;
    private final ContractorService contractorService;
    private final NotificationDeviceTokenService notificationDeviceTokenService;
    private final NotificationService notificationService;

    @Autowired
    public NotificationController(PushNotifictionHelper pushNotifictionHelper, ContractorService contractorService, NotificationDeviceTokenService notificationDeviceTokenService, NotificationService notificationService) {
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.contractorService = contractorService;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
        this.notificationService = notificationService;
    }

    @GetMapping("/create/{id}")
    public String create(@PathVariable Integer id, Model model) {
        ContractorEntity contractorEntity = contractorService.findById(id);
        model.addAttribute("notification", new NotificationEntity(contractorEntity));
        return "notification/create";
    }

    @PostMapping("/sendNotification")
    public String saveProcess(
            @Valid @ModelAttribute("notification") NotificationEntity notificationEntity,
            BindingResult bindingResult, Model model) {
        String clickAction = "";
        notificationEntity.setClickAction(clickAction);
        try {
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(contractorService.findById(notificationEntity.getContractorEntity().getId()))
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), notificationEntity.getTitle(), notificationEntity.getContent(), clickAction);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        notificationService.save(notificationEntity);
        model.addAttribute("contractors", contractorService.findAll());
        return "redirect:/contractor/index";
    }
}
