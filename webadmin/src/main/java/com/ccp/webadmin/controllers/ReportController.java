package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.NotificationEntity;
import com.ccp.webadmin.entities.ReportEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.services.*;
import com.ccp.webadmin.utils.PushNotifictionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("report")
public class ReportController {

    private final ReportTypeService reportTypeService;
    private final ReportService reportService;
    private final ContractorService contractorService;
    private final NotificationDeviceTokenService notificationDeviceTokenService;
    private final PushNotifictionHelper pushNotifictionHelper;
    private final NotificationService notificationService;

    @Autowired
    public ReportController(ReportTypeService reportTypeService, ReportService reportService, ContractorService contractorService, NotificationDeviceTokenService notificationDeviceTokenService, PushNotifictionHelper pushNotifictionHelper, NotificationService notificationService) {
        this.reportTypeService = reportTypeService;
        this.reportService = reportService;
        this.contractorService = contractorService;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.notificationService = notificationService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("feedbacks", reportService.findAll());
        model.addAttribute("feedbackTypes", reportTypeService.findAll());
        return "report/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("feedback", reportService.findById(id));
        model.addAttribute("feedbackTypes", reportTypeService.findAll());
        model.addAttribute("feedbackStatus", Arrays.asList(ReportEntity.Status.values()));
        return "report/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("feedback", new ReportEntity());
        model.addAttribute("feedbackTypes", reportTypeService.findAll());
        return "report/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("feedback") ReportEntity reportEntity,
            BindingResult bindingResult, Model model) {
        ReportEntity foundFeedback = reportService.findById(reportEntity.getId());
        ContractorEntity contractorEntity = contractorService.findById(foundFeedback.getContractorIsReported().getId());
        model.addAttribute("feedbackStatus", Arrays.asList(ReportEntity.Status.values()));
        model.addAttribute("feedbackTypes", reportTypeService.findAll());

        foundFeedback.setStatus(reportEntity.getStatus());
        reportService.save(foundFeedback);
        String title = "Warning Contractor " + contractorEntity.getName();
        String content = "You has been violated 2 times. The next time, you will be deactivated";
        String clickAction = "";
        NotificationEntity notificationEntity = new NotificationEntity();
        notificationEntity.setTitle(title);
        notificationEntity.setContent(content);
        notificationEntity.setClickAction(clickAction);
        notificationEntity.setContractorEntity(contractorEntity);
        if (contractorEntity.countReceivedFeedbackEntity() == 3){
            try {
                for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(contractorEntity)
                ) {
                    pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content, clickAction);
                }

            } catch (Exception e) {
                e.printStackTrace();
            }
            notificationService.save(notificationEntity);
        }

        Integer id = reportEntity.getId();
        return "redirect:detail/" +  id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
//        EquipmentTypeEntity equipmentTypeEntity = equipmentTypeService.findEquipmentTypeById(id);

//        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
//            equipmentTypeService.deleteById(id);
//        }
        reportService.deleteById(id);
        return "redirect:index";
    }
}
