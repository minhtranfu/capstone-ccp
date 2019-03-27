package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.services.ContractorService;
import com.ccp.webadmin.services.ContractorVerifyingImageService;
import com.ccp.webadmin.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("contractor")
public class ContractorController {

    private final ContractorService contractorService;
    private final ReportService reportService;
    private final ContractorVerifyingImageService contractorVerifyingImageService;

    @Autowired
    public ContractorController(ContractorService contractorService, ReportService reportService, ContractorVerifyingImageService contractorVerifyingImageService) {
        this.contractorService = contractorService;
        this.reportService = reportService;
        this.contractorVerifyingImageService = contractorVerifyingImageService;
    }

    @GetMapping({"", "/", "/index"})
    public String getcontractor(Model model) {
        model.addAttribute("contractors", contractorService.findAll());
        return "contractor/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        ContractorEntity contractorEntity = contractorService.findById(id);
        model.addAttribute("contractor", contractorEntity);
        model.addAttribute("verifyImages",contractorVerifyingImageService.findByContractor(contractorEntity));

        return "contractor/detail";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("contractor") ContractorEntity contractorEntity,
            BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {

            //todo updatedTime null !
            ContractorEntity foundContractor = contractorService.findById(contractorEntity.getId());
            contractorEntity.setCreatedTime(foundContractor.getCreatedTime());
            contractorEntity.setUpdatedTime(foundContractor.getUpdatedTime());
            contractorEntity.setReceivedFeedbackEntities(foundContractor.getReceivedFeedbackEntities());
            model.addAttribute("verifyImages",contractorVerifyingImageService.findByContractor(contractorEntity));
            return "contractor/detail";
        }

        ContractorEntity foundContractor = contractorService.findById(contractorEntity.getId());


        foundContractor.setName(contractorEntity.getName());
        foundContractor.setPhone(contractorEntity.getPhone());
        foundContractor.setEmail(contractorEntity.getEmail());

        contractorService.save(foundContractor);
        Integer id = contractorEntity.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/updateStatus")
    public String updateStatus(@RequestParam("id") Integer id) {
        ContractorEntity contractorEntity = contractorService.findById(id);

        //change contractor status Not Verify into Active
        switch (contractorEntity.getStatus()) {
            case NOT_VERIFIED:
                contractorEntity.setStatus(ContractorEntity.Status.ACTIVATED);
                break;
            case ACTIVATED:
                contractorEntity.setStatus(ContractorEntity.Status.DEACTIVATED);
                break;
            case DEACTIVATED:
                contractorEntity.setStatus(ContractorEntity.Status.ACTIVATED);
                break;
        }
        contractorService.save(contractorEntity);

        return "redirect:detail/" + id;
    }
}
