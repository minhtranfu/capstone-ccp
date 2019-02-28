package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

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
        model.addAttribute("equipmentStatus", Arrays.asList(EquipmentEntity.Status.values()));
        return "equipment/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("equipment", new EquipmentEntity());
        return "equipment/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("equipment") EquipmentEntity equipmentEntity,
            BindingResult bindingResult, Model model) {

        model.addAttribute("equipmentStatus", Arrays.asList(HiringTransactionEntity.Status.values()));
        EquipmentEntity foundEquipment = equipmentService.findById(equipmentEntity.getId());

        // TODO: 2019-02-26 set attributes
        foundEquipment.setStatus(equipmentEntity.getStatus());
        System.out.println("bbbb" + equipmentEntity.toString());
        System.out.println("aaa" + foundEquipment.toString());

        equipmentService.save(foundEquipment);
        Integer id = foundEquipment.getId();
        return "redirect:detail/" + id;

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
