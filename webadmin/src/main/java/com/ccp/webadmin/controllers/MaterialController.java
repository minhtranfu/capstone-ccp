package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.services.EquipmentImageService;
import com.ccp.webadmin.services.EquipmentService;
import com.ccp.webadmin.services.MaterialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("material")
public class MaterialController {

    private final MaterialService materialService;

    @Autowired
    public MaterialController(MaterialService materialService) {
        this.materialService = materialService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("materials", materialService.findAll());
        return "material/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        MaterialEntity materialEntity = materialService.findById(id);
        model.addAttribute("material", materialEntity);
        return "material/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("material", new MaterialEntity());
        return "material/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("material") MaterialEntity materialEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {

            //todo updatedTime null
            MaterialEntity foundMaterial = materialService.findById(materialEntity.getId());
            materialEntity.setContractorEntity(foundMaterial.getContractorEntity());
            materialEntity.setHidden(foundMaterial.getHidden());
            materialEntity.setCreatedTime(foundMaterial.getCreatedTime());
            materialEntity.setUpdatedTime(foundMaterial.getUpdatedTime());
            return "material/detail";
        }
        MaterialEntity foundMaterial = materialService.findById(materialEntity.getId());
        foundMaterial.setName(materialEntity.getName());
        foundMaterial.setPrice(materialEntity.getPrice());
        foundMaterial.setManufacturer(materialEntity.getManufacturer());


        materialService.save(foundMaterial);
        Integer id = foundMaterial.getId();
        return "redirect:detail/" + id;

    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        materialService.deleteById(id);
        return "redirect:index";
    }
}
