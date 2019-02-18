package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("general_equipment_type")
public class GeneralEquipmentTypeController {

    private final GeneralEquipmentTypeService generalEquipmentTypeService;
    private final EquipmentTypeService equipmentTypeService;

    @Autowired
    public GeneralEquipmentTypeController(GeneralEquipmentTypeService generalEquipmentTypeService, EquipmentTypeService equipmentTypeService) {
        this.generalEquipmentTypeService = generalEquipmentTypeService;
        this.equipmentTypeService = equipmentTypeService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        return "general_equipment_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("generalEquipmentType", generalEquipmentTypeService.findGeneralEquipmentTypeById(id));
        model.addAttribute("equipmentType", equipmentTypeService.findByGeneralEquipmentType(generalEquipmentTypeService.findGeneralEquipmentTypeById(id)));
        return "general_equipment_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("generalEquipmentType", new GeneralEquipmentTypeEntity());
        return "general_equipment_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("generalEquipmentType") GeneralEquipmentTypeEntity generalEquipmentTypeEntity,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            if(generalEquipmentTypeEntity.getId() != null){
                return "general_equipment_type/detail";
            } else{
                return "general_equipment_type/create";
            }
        }
        generalEquipmentTypeService.save(generalEquipmentTypeEntity);
        Integer id = generalEquipmentTypeEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        GeneralEquipmentTypeEntity generalEquipmentTypeEntity = generalEquipmentTypeService.findGeneralEquipmentTypeById(id);

        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
            generalEquipmentTypeService.deleteById(id);
        }
        return "redirect:index";
    }
}
