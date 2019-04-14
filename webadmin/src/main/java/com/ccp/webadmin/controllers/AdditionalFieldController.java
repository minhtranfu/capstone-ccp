package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.services.AdditionalSpecialFieldService;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;
import java.util.List;

@Controller
@RequestMapping("additional_special_field")
public class AdditionalFieldController {

    private final EquipmentTypeService equipmentTypeService;
    private final AdditionalSpecialFieldService additionalSpecialFieldService;


    @Autowired
    public AdditionalFieldController(EquipmentTypeService equipmentTypeService, AdditionalSpecialFieldService additionalSpecialFieldService) {
        this.equipmentTypeService = equipmentTypeService;
        this.additionalSpecialFieldService = additionalSpecialFieldService;
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("additionalSpecialField", additionalSpecialFieldService.findById(id));
        model.addAttribute("dataTypes", Arrays.asList(AdditionalSpecialFieldEntity.Datatype.values()));
        return "additional_special_field/detail";
    }

    @GetMapping("/create/{id}")
    public String create(@PathVariable Integer id, Model model) {
        model.addAttribute("additionalSpecialField", new AdditionalSpecialFieldEntity(equipmentTypeService.findEquipmentTypeById(id)));
        model.addAttribute("dataTypes", Arrays.asList(AdditionalSpecialFieldEntity.Datatype.values()));
        return "additional_special_field/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("additionalSpecialField") AdditionalSpecialFieldEntity additionalSpecialFieldEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            if(additionalSpecialFieldEntity.getId() != null){
                model.addAttribute("dataTypes", Arrays.asList(AdditionalSpecialFieldEntity.Datatype.values()));
                return "additional_special_field/detail";
            } else{
                model.addAttribute("dataTypes", Arrays.asList(AdditionalSpecialFieldEntity.Datatype.values()));
                return "additional_special_field/create";
            }
        }
        model.addAttribute("dataTypes", Arrays.asList(AdditionalSpecialFieldEntity.Datatype.values()));
        additionalSpecialFieldService.save(additionalSpecialFieldEntity);
        Integer id = additionalSpecialFieldEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        AdditionalSpecialFieldEntity  additionalSpecialFieldEntity = additionalSpecialFieldService.findById(id);
        additionalSpecialFieldService.deleteById(id);
        return "equipment_type/index";
    }
}
