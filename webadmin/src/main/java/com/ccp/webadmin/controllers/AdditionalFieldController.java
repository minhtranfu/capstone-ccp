package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.services.AdditionalSpecialFieldService;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

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

//    @GetMapping({"", "/", "/index"})
//    public String getAll(Model model) {
//        model.addAttribute("additionalfield", ad.findAll());
//        return "equipment_type/index";
//    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("additionalSpecialField", additionalSpecialFieldService.findById(id));
        return "additional_special_field/detail";
    }

    @GetMapping("/create/{id}")
    public String create(@PathVariable Integer id, Model model) {
        model.addAttribute("additionalSpecialField", new AdditionalSpecialFieldEntity(equipmentTypeService.findEquipmentTypeById(id)));
        return "additional_special_field/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("additionalSpecialField") AdditionalSpecialFieldEntity additionalSpecialFieldEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            Integer id = additionalSpecialFieldEntity.getId();
            return "additional_special_field/detail/" + id;
        }
        additionalSpecialFieldService.save(additionalSpecialFieldEntity);
        Integer id = additionalSpecialFieldEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        EquipmentTypeEntity equipmentTypeEntity = equipmentTypeService.findEquipmentTypeById(id);

//        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
//            equipmentTypeService.deleteById(id);
//        }
        equipmentTypeService.deleteById(id);
        return "redirect:index";
    }
}
