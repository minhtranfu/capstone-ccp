package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.MigrateDTO;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import com.ccp.webadmin.entities.GeneralMaterialTypeEntity;
import com.ccp.webadmin.services.MaterialTypeService;
import com.ccp.webadmin.services.GeneralMaterialTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("general_material_type")
public class GeneralMaterialTypeController {

    private final GeneralMaterialTypeService generalMaterialTypeService;
    private final MaterialTypeService materialTypeService;

    @Autowired
    public GeneralMaterialTypeController(GeneralMaterialTypeService generalMaterialTypeService, MaterialTypeService materialTypeService) {
        this.generalMaterialTypeService = generalMaterialTypeService;
        this.materialTypeService = materialTypeService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        return "general_material_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("generalMaterialType", generalMaterialTypeService.findById(id));
        model.addAttribute("materialType", materialTypeService.findByGeneralMaterialType(generalMaterialTypeService.findById(id)));
        return "general_material_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("generalMaterialType", new GeneralMaterialTypeEntity());
        return "general_material_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("generalMaterialType") GeneralMaterialTypeEntity generalMaterialTypeEntity,
            BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            if (generalMaterialTypeEntity.getId() != null) {
                return "general_material_type/detail";
            } else {
                return "general_material_type/create";
            }
        }
        generalMaterialTypeService.save(generalMaterialTypeEntity);
        Integer id = generalMaterialTypeEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        GeneralMaterialTypeEntity generalMaterialTypeEntity = generalMaterialTypeService.findById(id);
        generalMaterialTypeEntity.setDeleted(true);
        List<MaterialTypeEntity> materialTypeEntities = materialTypeService.findByGeneralMaterialType(generalMaterialTypeEntity);
        for (MaterialTypeEntity materialTypeEntity : materialTypeEntities) {
            materialTypeEntity.setDeleted(true);
            materialTypeService.save(materialTypeEntity);
        }
        generalMaterialTypeService.save(generalMaterialTypeEntity);
        return "redirect:index";
    }

    @GetMapping("/migrate")
    public String migrate(Model model) {
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        model.addAttribute("migrateDTO", new MigrateDTO());
        return "general_material_type/migrate";
    }

    @PostMapping("/migrateCate")
    public String migrateCate(
            @ModelAttribute("migrateDTO") MigrateDTO migrateDTO,
            Model model) {
        if (migrateDTO.getFromCate() == migrateDTO.getToCate()) {
            model.addAttribute("errorMessage", "Two Category Must Be Different");
            model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
            model.addAttribute("migrateDTO", new MigrateDTO());
            return "general_material_type/migrate";
        }
        GeneralMaterialTypeEntity fromCategory = generalMaterialTypeService.findById(migrateDTO.getFromCate());
        GeneralMaterialTypeEntity toCategory = generalMaterialTypeService.findById(migrateDTO.getToCate());
        List<MaterialTypeEntity> MaterialTypeEntities = materialTypeService.findByGeneralMaterialType(fromCategory);
        for (MaterialTypeEntity materialTypeEntity : MaterialTypeEntities) {
            materialTypeEntity.setGeneralMaterialTypeEntity(toCategory);
            materialTypeService.save(materialTypeEntity);
        }
        generalMaterialTypeService.deleteById(fromCategory.getId());
        return "redirect:index";
    }
}
