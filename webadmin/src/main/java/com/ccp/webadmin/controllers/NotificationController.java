package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.NotificationDTO;
import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.services.ContractorService;
import com.ccp.webadmin.services.NotificationDeviceTokenService;
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

    @Autowired
    public NotificationController(PushNotifictionHelper pushNotifictionHelper, ContractorService contractorService, NotificationDeviceTokenService notificationDeviceTokenService) {
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.contractorService = contractorService;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
    }

    @GetMapping("/create/{id}")
    public String create(@PathVariable Integer id, Model model) {
        model.addAttribute("notification", new NotificationDTO(id));
        model.addAttribute("contractor", contractorService.findById(id));

        return "notification/create";
    }

    @PostMapping("/sendNotification")
    public String saveProcess(
            @Valid @ModelAttribute("notification") NotificationDTO notificationDTO,
            BindingResult bindingResult, Model model) {
        try {
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(contractorService.findById(notificationDTO.getContractorId()))
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), notificationDTO.getTitle(), notificationDTO.getContent());
                System.out.println("sendNotification, key="+notificationDeviceTokenEntity.getRegistrationToken());

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        model.addAttribute("contractors", contractorService.findAll());
        return "redirect:./contractor/index";
    }
}
