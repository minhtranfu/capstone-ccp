package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.MigrateDTO;
import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("material_type")
public class MaterialTypeController {

    private final GeneralMaterialTypeService generalMaterialTypeService;
    private final MaterialTypeService materialTypeService;
    private final MaterialService materialService;

    @Autowired
    public MaterialTypeController(GeneralMaterialTypeService generalMaterialTypeService, MaterialTypeService materialTypeService, MaterialService materialService) {
        this.generalMaterialTypeService = generalMaterialTypeService;
        this.materialTypeService = materialTypeService;
        this.materialService = materialService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("materialTypes", materialTypeService.findAll());
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        return "material_type/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("materialType", materialTypeService.findById(id));
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        return "material_type/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("materialType", new MaterialTypeEntity());
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        return "material_type/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("materialType") MaterialTypeEntity materialTypeEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {

            if(materialTypeEntity.getId() != null){
                model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
                return "material_type/detail";
            } else{
                model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
                return "material_type/create";
            }

        }
        model.addAttribute("generalMaterialTypes", generalMaterialTypeService.findAll());
        materialTypeService.save(materialTypeEntity);
        long id = materialTypeEntity.getId();
        return "redirect:detail/" +  id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        MaterialTypeEntity materialTypeEntity = materialTypeService.findById(id);
        materialTypeEntity.setDeleted(true);
        materialTypeService.save(materialTypeEntity);
        return "redirect:index";
    }

    @GetMapping("/migrate")
    public String migrate(Model model) {
        model.addAttribute("materialTypes", materialTypeService.findAll());
        model.addAttribute("migrateDTO", new MigrateDTO());
        return "material_type/migrate";
    }

    @PostMapping("/migrateCate")
    public String migrateCate(
            @ModelAttribute("migrateDTO") MigrateDTO migrateDTO,
            Model model) {
        if(migrateDTO.getFromCate() == migrateDTO.getToCate()){
            model.addAttribute("errorMessage","Two Type Must Be Different");
            model.addAttribute("materialTypes", materialTypeService.findAll());
            model.addAttribute("migrateDTO", new MigrateDTO());
            return  "material_type/migrate";
        }
        MaterialTypeEntity fromCategory = materialTypeService.findById(migrateDTO.getFromCate());
        MaterialTypeEntity toCategory = materialTypeService.findById(migrateDTO.getToCate());
        migrateOject(fromCategory,toCategory);
        materialTypeService.deleteById(fromCategory.getId());
        return "redirect:index";
    }

    public void migrateOject(MaterialTypeEntity fromCategory, MaterialTypeEntity toCategory){
        List<MaterialEntity> materialEntities = materialService.findByMaterialType(fromCategory);
        for (MaterialEntity  materialEntity: materialEntities) {
            materialEntity.setMaterialTypeEntity(toCategory);
            materialService.save(materialEntity);
        }
    }


}
