package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.FeedbackTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("feedback_type")
public class FeedbackTypeController {

    private final FeedbackTypeService feedbackTypeService;

    @Autowired
    public FeedbackTypeController(FeedbackTypeService feedbackTypeService) {
        this.feedbackTypeService = feedbackTypeService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
        return "feedback_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("feedbackType", feedbackTypeService.findById(id));
//        model.addAttribute("equipmentType", equipmentTypeService.findByGeneralEquipmentType(generalEquipmentTypeService.findGeneralEquipmentTypeById(id)));
        return "feedback_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("feedbackType", new FeedbackTypeEntity());
        return "feedback_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("feedbackType") FeedbackTypeEntity feedbackTypeEntity,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            if(feedbackTypeEntity.getId() != null){
                return "feedback_type/detail";
            } else{
                return "feedback_type/create";
            }
        }
        feedbackTypeService.save(feedbackTypeEntity);
        Integer id = feedbackTypeEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
//        FeedbackTypeEntity feedbackTypeEntity = feedbackTypeService.(id);
//
//        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
//            generalEquipmentTypeService.deleteById(id);
//        }
        feedbackTypeService.deleteById(id);
        return "redirect:index";
    }
}
