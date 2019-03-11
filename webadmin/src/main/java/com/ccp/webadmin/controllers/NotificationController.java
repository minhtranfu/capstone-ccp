package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.NotificationDTO;
import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.services.ContractorService;
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


    @Autowired
    public NotificationController(PushNotifictionHelper pushNotifictionHelper, ContractorService contractorService) {
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.contractorService = contractorService;
    }

    @GetMapping("/create/{id}")
    public String create(@PathVariable Integer id, Model model) {
        model.addAttribute("notification", new NotificationDTO(contractorService.findById(id)));


        return "notification/create";
    }

    @PostMapping("/sendNotification")
    public String saveProcess(
            @Valid @ModelAttribute("notification") NotificationDTO notificationDTO,
            BindingResult bindingResult, Model model) {
        try {
            pushNotifictionHelper.pushFCMNotification("d8-Ink9CAt8:APA91bHkISrpC9Pp7CX6VB6MSlx5qAzxIc8TCWFO7RgYpdZUfOvOdI1PP1syZcS9CpNDuIEUr3u1Wx1mT_5mFlxnops-Zk6fGtKwL_3POKRmkO4931e38xauhn6YBZA6yMv4IF68QZV1", notificationDTO.getTitle(), notificationDTO.getContent());
        } catch (Exception e) {
            e.printStackTrace();
        }
        model.addAttribute("contractors", contractorService.findAll());
        return "contractor/index";
    }
}
