package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
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
@RequestMapping("equipment_type")
public class EquipmentTypeController {

    private final GeneralEquipmentTypeService generalEquipmentTypeService;
    private final EquipmentTypeService equipmentTypeService;
    private final AdditionalSpecialFieldService additionalSpecialFieldService;


    @Autowired
    public EquipmentTypeController(GeneralEquipmentTypeService generalEquipmentTypeService, EquipmentTypeService equipmentTypeService, AdditionalSpecialFieldService additionalSpecialFieldService) {
        this.generalEquipmentTypeService = generalEquipmentTypeService;
        this.equipmentTypeService = equipmentTypeService;
        this.additionalSpecialFieldService = additionalSpecialFieldService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("equipmentTypes", equipmentTypeService.findAll());
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        return "equipment_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("equipmentType", equipmentTypeService.findEquipmentTypeById(id));
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        model.addAttribute("additionalSpecialField", additionalSpecialFieldService.findByEquipmentType(equipmentTypeService.findEquipmentTypeById(id)));
        return "equipment_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("equipmentType", new EquipmentTypeEntity());
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        return "equipment_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("equipmentType") EquipmentTypeEntity equipmentTypeEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
            long id = equipmentTypeEntity.getId();
            return "equipment_type/detail/" + id;
        }
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        equipmentTypeService.save(equipmentTypeEntity);
        long id = equipmentTypeEntity.getId();
        return "redirect:detail/" +  id;
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
