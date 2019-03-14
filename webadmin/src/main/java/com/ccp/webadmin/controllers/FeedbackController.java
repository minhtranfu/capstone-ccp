package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
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
@RequestMapping("feedback")
public class FeedbackController {

    private final FeedbackTypeService feedbackTypeService;
    private final FeedbackService feedbackService;

    @Autowired
    public FeedbackController(FeedbackTypeService feedbackTypeService, FeedbackService feedbackService) {
        this.feedbackTypeService = feedbackTypeService;
        this.feedbackService = feedbackService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("feedbacks", feedbackService.findAll());
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
        return "feedback/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("feedback", feedbackService.findById(id));
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
        model.addAttribute("feedbackStatus", Arrays.asList(FeedbackEntity.Status.values()));
        return "feedback/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("feedback", new FeedbackEntity());
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
        return "feedback/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("feedback") FeedbackEntity feedbackEntity,
            BindingResult bindingResult, Model model) {
        FeedbackEntity foundFeedback = feedbackService.findById(feedbackEntity.getId());
        model.addAttribute("feedbackStatus", Arrays.asList(FeedbackEntity.Status.values()));
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());

        foundFeedback.setStatus(feedbackEntity.getStatus());
        System.out.println(foundFeedback);
        feedbackService.save(foundFeedback);
        Integer id = feedbackEntity.getId();
        return "redirect:detail/" +  id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
//        EquipmentTypeEntity equipmentTypeEntity = equipmentTypeService.findEquipmentTypeById(id);

//        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
//            equipmentTypeService.deleteById(id);
//        }
        feedbackService.deleteById(id);
        return "redirect:index";
    }
}
