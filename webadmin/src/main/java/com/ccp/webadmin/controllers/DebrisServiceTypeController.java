package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.MigrateDTO;
import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.services.DebrisServiceTypeService;
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
@RequestMapping("debris_service_type")
public class DebrisServiceTypeController {

    private final DebrisServiceTypeService debrisServiceTypeService;

    @Autowired
    public DebrisServiceTypeController(DebrisServiceTypeService debrisServiceTypeService) {
        this.debrisServiceTypeService = debrisServiceTypeService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("debrisServiceTypes", debrisServiceTypeService.findAll());
        return "debris_service_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("debrisServiceType", debrisServiceTypeService.findById(id));
        return "debris_service_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("debrisServiceType", new DebrisServiceTypeEntity());
        return "debris_service_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("debrisServiceType") DebrisServiceTypeEntity debrisServiceTypeEntity,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            if(debrisServiceTypeEntity.getId() != null){
                return "debris_service_type/detail";
            } else{
                return "debris_service_type/create";
            }
        }
        debrisServiceTypeService.save(debrisServiceTypeEntity);
        Integer id = debrisServiceTypeEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        DebrisServiceTypeEntity debrisServiceTypeEntity = debrisServiceTypeService.findById(id);

        return "redirect:index";
    }

//    @GetMapping("/migrate")
//    public String migrate(Model model) {
//        model.addAttribute("debrisServiceTypes", debrisServiceTypeService.findAll());
//        model.addAttribute("migrateDTO", new MigrateDTO());
//        return "debris_service_type/migrate";
//    }
//
//    @PostMapping("/migrateCate")
//    public String migrateCate(
//            @ModelAttribute("migrateDTO") MigrateDTO migrateDTO,
//            Model model) {
//        if(migrateDTO.getFromCate() == migrateDTO.getToCate()){
//            model.addAttribute("errorMessage","Two Category Must Be Different");
//            model.addAttribute("generalEquipmentTypes", generalEquipmentTypeService.findAll());
//            model.addAttribute("migrateDTO", new MigrateDTO());
//            return  "debris_service_type/migrate";
//        }
//        GeneralEquipmentTypeEntity fromCategory = generalEquipmentTypeService.findGeneralEquipmentTypeById(migrateDTO.getFromCate());
//        GeneralEquipmentTypeEntity toCategory = generalEquipmentTypeService.findGeneralEquipmentTypeById(migrateDTO.getToCate());
//        List<EquipmentTypeEntity> equipmentTypeEntities = equipmentTypeService.findByGeneralEquipmentType(fromCategory);
//        for (EquipmentTypeEntity equipmentTypeEntity : equipmentTypeEntities) {
//            equipmentTypeEntity.setGeneralEquipmentType(toCategory);
//            equipmentTypeService.save(equipmentTypeEntity);
//        }
//        generalEquipmentTypeService.deleteById(fromCategory.getId());
//        return "redirect:index";
//    }
}
