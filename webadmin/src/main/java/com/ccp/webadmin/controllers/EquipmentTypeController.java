package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.MigrateDTO;
import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
import com.ccp.webadmin.services.AdditionalSpecialFieldService;
import com.ccp.webadmin.services.EquipmentService;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("equipment_type")
public class EquipmentTypeController {

    private final GeneralEquipmentTypeService generalEquipmentTypeService;
    private final EquipmentTypeService equipmentTypeService;
    private final EquipmentService equipmentService;
    private final AdditionalSpecialFieldService additionalSpecialFieldService;

    @Autowired
    public EquipmentTypeController(GeneralEquipmentTypeService generalEquipmentTypeService, EquipmentTypeService equipmentTypeService, EquipmentService equipmentService, AdditionalSpecialFieldService additionalSpecialFieldService) {
        this.generalEquipmentTypeService = generalEquipmentTypeService;
        this.equipmentTypeService = equipmentTypeService;
        this.equipmentService = equipmentService;
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

            if(equipmentTypeEntity.getId() != null){
                model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
                return "equipment_type/detail";
            } else{
                model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
                return "equipment_type/create";
            }

        }
        model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
        equipmentTypeService.save(equipmentTypeEntity);
        long id = equipmentTypeEntity.getId();
        return "redirect:detail/" +  id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        EquipmentTypeEntity equipmentTypeEntity = equipmentTypeService.findEquipmentTypeById(id);
        equipmentTypeEntity.setDeleted(true);
        List<AdditionalSpecialFieldEntity> additionalSpecialFieldEntities = additionalSpecialFieldService.findByEquipmentType(equipmentTypeEntity);
        for (AdditionalSpecialFieldEntity additionalSpecialFieldEntity : additionalSpecialFieldEntities) {
            additionalSpecialFieldEntity.setDeleted(true);
            additionalSpecialFieldService.save(additionalSpecialFieldEntity);
        }
        equipmentTypeService.save(equipmentTypeEntity);
        return "redirect:index";
    }

    @GetMapping("/migrate")
    public String migrate(Model model) {
        model.addAttribute("equipmentTypes", equipmentTypeService.findAll());
        model.addAttribute("migrateDTO", new MigrateDTO());
        return "equipment_type/migrate";
    }

    @PostMapping("/migrateCate")
    public String migrateCate(
            @ModelAttribute("migrateDTO") MigrateDTO migrateDTO,
            Model model) {
        if(migrateDTO.getFromCate() == migrateDTO.getToCate()){
            model.addAttribute("errorMessage","Two Type Must Be Different");
            model.addAttribute("equipmentTypes", equipmentTypeService.findAll());
            model.addAttribute("migrateDTO", new MigrateDTO());
            return  "equipment_type/migrate";
        }
        EquipmentTypeEntity fromCategory = equipmentTypeService.findEquipmentTypeById(migrateDTO.getFromCate());
        EquipmentTypeEntity toCategory = equipmentTypeService.findEquipmentTypeById(migrateDTO.getToCate());
        migrateEquipment(fromCategory,toCategory);
        equipmentTypeService.deleteById(fromCategory.getId());
        return "redirect:index";
    }

    public void migrateEquipment(EquipmentTypeEntity fromCategory, EquipmentTypeEntity toCategory){
        List<EquipmentEntity> equipmentEntities = equipmentService.findByEquipmentType(fromCategory);
        for (EquipmentEntity  equipmentEntity: equipmentEntities) {
            equipmentEntity.setEquipmentTypeEntity(toCategory);
            equipmentService.save(equipmentEntity);
        }
    }

    public void migrateAdditionalField(EquipmentTypeEntity fromCategory, EquipmentTypeEntity toCategory){
        List<AdditionalSpecialFieldEntity> additionalSpecialFieldEntities = additionalSpecialFieldService.findByEquipmentType(fromCategory);
        for (AdditionalSpecialFieldEntity additionalSpecialFieldEntity: additionalSpecialFieldEntities) {
//            if(additionalSpecialFieldEntity.)
            additionalSpecialFieldEntity.setEquipmentTypeEntity(toCategory);
            additionalSpecialFieldService.save(additionalSpecialFieldEntity);
        }
    }


}
