package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.services.EquipmentImageService;
import com.ccp.webadmin.services.EquipmentService;
import com.ccp.webadmin.services.EquipmentTypeService;
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
    private final EquipmentTypeService equipmentTypeService;
    private final EquipmentImageService equipmentImageService;

    @Autowired
    public EquipmentController(EquipmentService equipmentService, EquipmentTypeService equipmentTypeService, EquipmentImageService equipmentImageService) {
        this.equipmentService = equipmentService;
        this.equipmentTypeService = equipmentTypeService;
        this.equipmentImageService = equipmentImageService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("equipments", equipmentService.findAll());
        return "equipment/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        EquipmentEntity equipmentEntity = equipmentService.findById(id);
        model.addAttribute("equipment", equipmentEntity);
        model.addAttribute("equipmentImage", equipmentImageService.findByEquipmentEntity(equipmentEntity));
        model.addAttribute("equipmentType", equipmentTypeService.findAll());
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
        if (bindingResult.hasErrors()) {

            //todo updatedTime null
            EquipmentEntity foundEquipment = equipmentService.findById(equipmentEntity.getId());
            equipmentEntity.setContractorEntity(foundEquipment.getContractorEntity());
            equipmentEntity.setStatus(foundEquipment.getStatus());
            equipmentEntity.setCreatedTime(foundEquipment.getCreatedTime());
            equipmentEntity.setUpdatedTime(foundEquipment.getUpdatedTime());
            model.addAttribute("equipmentImage", equipmentImageService.findByEquipmentEntity(foundEquipment));
            model.addAttribute("equipmentType", equipmentTypeService.findAll());
            return "equipment/detail";
        }
        model.addAttribute("equipmentStatus", Arrays.asList(HiringTransactionEntity.Status.values()));
        model.addAttribute("equipmentType", equipmentTypeService.findAll());
        EquipmentEntity foundEquipment = equipmentService.findById(equipmentEntity.getId());
        foundEquipment.setName(equipmentEntity.getName());
        foundEquipment.setEquipmentTypeEntity(equipmentEntity.getEquipmentTypeEntity());
        foundEquipment.setDailyPrice(equipmentEntity.getDailyPrice());
        foundEquipment.setDeliveryPrice(equipmentEntity.getDeliveryPrice());
        foundEquipment.setAddress(equipmentEntity.getAddress());

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
