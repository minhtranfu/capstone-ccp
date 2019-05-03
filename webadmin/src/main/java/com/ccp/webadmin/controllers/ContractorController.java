package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.services.*;
import com.ccp.webadmin.utils.PushNotifictionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("contractor")
public class ContractorController {

    private final ContractorService contractorService;
    private final ReportService reportService;
    private final PushNotifictionHelper pushNotifictionHelper;
    private final ContractorVerifyingImageService contractorVerifyingImageService;
    private final NotificationService notificationService;
    private final NotificationDeviceTokenService notificationDeviceTokenService;

    public ContractorController(ContractorService contractorService, ReportService reportService, PushNotifictionHelper pushNotifictionHelper, ContractorVerifyingImageService contractorVerifyingImageService, NotificationService notificationService, NotificationDeviceTokenService notificationDeviceTokenService) {
        this.contractorService = contractorService;
        this.reportService = reportService;
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.contractorVerifyingImageService = contractorVerifyingImageService;
        this.notificationService = notificationService;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
    }




    @GetMapping({"", "/", "/index"})
    public String getContractor(Model model) {
        model.addAttribute("contractors", contractorService.findAll());
        return "contractor/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        ContractorEntity contractorEntity = contractorService.findById(id);
        model.addAttribute("contractor", contractorEntity);
        model.addAttribute("verifyImages", contractorVerifyingImageService.findByContractor(contractorEntity));

        return "contractor/detail";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("contractor") ContractorEntity contractorEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {

            //todo updatedTime null !
            ContractorEntity foundContractor = contractorService.findById(contractorEntity.getId());
            contractorEntity.setCreatedTime(foundContractor.getCreatedTime());
            contractorEntity.setUpdatedTime(foundContractor.getUpdatedTime());
            contractorEntity.setReceivedFeedbackEntities(foundContractor.getReceivedFeedbackEntities());
            model.addAttribute("verifyImages", contractorVerifyingImageService.findByContractor(contractorEntity));
            return "contractor/detail";
        }

        ContractorEntity foundContractor = contractorService.findById(contractorEntity.getId());


        foundContractor.setName(contractorEntity.getName());
        foundContractor.setPhone(contractorEntity.getPhone());
        foundContractor.setEmail(contractorEntity.getEmail());

        contractorService.save(foundContractor);
        Integer id = contractorEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/updateStatus")
    public String updateStatus(@RequestParam("id") Integer id) {

        ContractorEntity contractorEntity = contractorService.findById(id);

        //change contractor status Not Verify into Active
        switch (contractorEntity.getStatus()) {
            case NOT_VERIFIED:
                contractorEntity.setStatus(ContractorEntity.Status.ACTIVATED);
                try {
                    for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(contractorEntity)
                    ) {
                        pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content, clickAction);
                    }

                } catch (Exception e) {
                    e.printStackTrace();
                }
                notificationService.save(notificationEntity);
                break;
            case ACTIVATED:
                contractorEntity.setStatus(ContractorEntity.Status.DEACTIVATED);
                break;
            case DEACTIVATED:
                contractorEntity.setStatus(ContractorEntity.Status.ACTIVATED);
                break;
        }
        contractorService.save(contractorEntity);

        return "redirect:detail/" + id;
    }

    @GetMapping("/verifyContractorPicture")
    public String verifyContractorPicture(@RequestParam("id") Integer id, @RequestParam("imageId") Integer imageId) {
        ContractorVerifyingImageEntity contractorVerifyingImageEntity = contractorVerifyingImageService.findById(imageId);
        if (contractorVerifyingImageEntity.isVerified() == false) {
            contractorVerifyingImageEntity.setVerified(true);
        } else {
            contractorVerifyingImageEntity.setVerified(false);
        }
        contractorVerifyingImageService.save(contractorVerifyingImageEntity);

        return "redirect:detail/" + id;
    }
}
