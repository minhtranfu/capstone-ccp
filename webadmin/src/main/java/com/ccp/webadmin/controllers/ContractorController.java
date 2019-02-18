package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.services.ContractorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDateTime;

@Controller
@RequestMapping("contractor")
public class ContractorController {

    private final ContractorService contractorService;

    @Autowired
    public ContractorController(ContractorService contractorService) {
        this.contractorService = contractorService;
    }

    @GetMapping({"", "/", "/index"})
    public String getcontractor(Model model) {
        model.addAttribute("contractors", contractorService.findAll());
        return "contractor/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("contractor", contractorService.findById(id));
        return "contractor/detail";
    }

//    @GetMapping("/active/{id}")
//    public String active(@PathVariable("id") Integer id, Model model) {
//        ContractorEntity contractorEntity = contractorService.findById(id);
//        contractorEntity.setActivated(true);
//        contractorService.save(contractorEntity);
//        return "contractor/index";
//    }
//
//    @GetMapping("/deactive/{id}")
//    public String deactive(@PathVariable("id") Integer id, Model model) {
//        ContractorEntity contractorEntity = contractorService.findById(id);
//        contractorEntity.setActivated(false);
//        contractorService.save(contractorEntity);
//        return "contractor/index";
//    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("contractor") ContractorEntity contractorEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            Integer id = contractorEntity.getId();
            return "contractor/detail/" + id;
        }

        contractorService.save(contractorEntity);
        Integer id = contractorEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/updateStatus")
    public String updateStatus(@RequestParam("id") Integer id) {
        ContractorEntity contractorEntity = contractorService.findById(id);

        //change contractor status Not Verify into Active
        switch (contractorEntity.getStatus()) {
            case 0:
                contractorEntity.setStatus(1);
                contractorEntity.setUpdatedTime(LocalDateTime.now());
                break;
            case 1:
                contractorEntity.setStatus(2);
                contractorEntity.setUpdatedTime(LocalDateTime.now());
                break;
            case 2:
                contractorEntity.setStatus(1);
                contractorEntity.setUpdatedTime(LocalDateTime.now());
                break;
        }
        contractorService.save(contractorEntity);

        return "redirect:detail/" + id;
    }
}
