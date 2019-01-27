package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
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

    @Autowired
    public EquipmentTypeController(GeneralEquipmentTypeService generalEquipmentTypeService, EquipmentTypeService equipmentTypeService) {
        this.generalEquipmentTypeService = generalEquipmentTypeService;
        this.equipmentTypeService = equipmentTypeService;
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
            @Valid @ModelAttribute("e") EquipmentTypeEntity equipmentTypeEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
            return "equipment_type/detail";
        }
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        equipmentTypeService.save(equipmentTypeEntity);
        return "redirect:detail";
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
