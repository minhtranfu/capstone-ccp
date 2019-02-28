package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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
        if (bindingResult.hasErrors()) {

            if(feedbackEntity.getId() != null){
                model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
                return "feedback/detail";
            } else{
                model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
                return "feedback/create";
            }

        }
        model.addAttribute("feedbackTypes", feedbackTypeService.findAll());
        feedbackService.save(feedbackEntity);
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
