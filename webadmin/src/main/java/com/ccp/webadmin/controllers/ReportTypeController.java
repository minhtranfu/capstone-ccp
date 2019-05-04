package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ReportTypeEntity;
import com.ccp.webadmin.services.ReportTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("report_type")
public class ReportTypeController {

    private final ReportTypeService reportTypeService;

    @Autowired
    public ReportTypeController(ReportTypeService reportTypeService) {
        this.reportTypeService = reportTypeService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("feedbackTypes", reportTypeService.findAll());
        return "report_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("feedbackType", reportTypeService.findById(id));
        return "report_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("feedbackType", new ReportTypeEntity());
        return "report_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("feedbackType") ReportTypeEntity reportTypeEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            if(reportTypeEntity.getId() != null){
                return "report_type/detail";
            } else{
                return "report_type/create";
            }
        }
        if(reportTypeService.existsByName(reportTypeEntity.getName())){
            model.addAttribute("errorMessage", "Existed report type's name");
            if(reportTypeEntity.getId() != null){
                return "report_type/detail";
            } else{
                return "report_type/create";
            }
        }
        reportTypeService.save(reportTypeEntity);
        Integer id = reportTypeEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        ReportTypeEntity reportTypeEntity = reportTypeService.findById(id);
        reportTypeEntity.setDeleted(true);
        reportTypeService.save(reportTypeEntity);
        return "redirect:index";
    }
}
