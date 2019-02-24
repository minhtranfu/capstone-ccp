package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("equipment")
public class EquipmentController {

    private final EquipmentService equipmentService;

    @Autowired
    public EquipmentController(EquipmentService equipmentService) {
        this.equipmentService = equipmentService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("equipments", equipmentService.findAll());
        return "equipment/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("equipment", equipmentService.findById(id));
        return "equipment/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("equipment", new EquipmentEntity());
        return "equipment/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("feedback") EquipmentEntity equipmentEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {

            if(equipmentEntity.getId() != null){
                model.addAttribute("equipments", equipmentService.findAll());
                return "equipment/detail";
            } else{
                model.addAttribute("equipments", equipmentService.findAll());
                return "equipment/create";
            }

        }
        model.addAttribute("feedbackTypes", equipmentService.findAll());
        equipmentService.save(equipmentEntity);
        long id = equipmentEntity.getId();
        return "redirect:detail/" +  id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
//        EquipmentTypeEntity equipmentTypeEntity = equipmentTypeService.findEquipmentTypeById(id);

//        if (equipmentTypeService.existsEquipmentTypeByGeneralEquipmentType(generalEquipmentTypeEntity) == false) {
//            equipmentTypeService.deleteById(id);
//        }
        equipmentService.deleteById(id);
        return "redirect:index";
    }
}
