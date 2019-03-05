package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.services.EquipmentService;
import com.ccp.webadmin.services.FeedbackTypeService;
import com.ccp.webadmin.services.HiringTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("hiring_transaction")
public class HiringTransactionController {

    private final HiringTransactionService hiringTransactionService;
    private final EquipmentService equipmentService;

    @Autowired
    public HiringTransactionController(HiringTransactionService hiringTransactionService, EquipmentService equipmentService) {
        this.hiringTransactionService = hiringTransactionService;
        this.equipmentService = equipmentService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("transactions", hiringTransactionService.findAll());
        return "hiring_transaction/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("transaction", hiringTransactionService.findById(id));
        model.addAttribute("transactionStatus", Arrays.asList(HiringTransactionEntity.Status.values()));
        model.addAttribute("equipmentStatus", Arrays.asList(EquipmentEntity.Status.values()));
        model.addAttribute("messageFail", "");
        return "hiring_transaction/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("transaction", new HiringTransactionEntity());
        model.addAttribute("errorMessage", "");
        return "hiring_transaction/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("transaction") HiringTransactionEntity hiringTransactionEntity,
//            @ModelAttribute("errorMessage") String error,
            BindingResult bindingResult, Model model, RedirectAttributes attributes) {

        model.addAttribute("transactionStatus", Arrays.asList(HiringTransactionEntity.Status.values()));
        model.addAttribute("equipmentStatus", Arrays.asList(EquipmentEntity.Status.values()));
        HiringTransactionEntity foundHiringTransaction = hiringTransactionService.findById(hiringTransactionEntity.getId());

        // TODO: 2019-02-26 set attributes
        foundHiringTransaction.setStatus(hiringTransactionEntity.getStatus());
        if (foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.PENDING)
                || foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.ACCEPTED)
                || foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.DENIED)
                || foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.FINISHED)
                || foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.CANCELED)
        ) {
            if (hiringTransactionEntity.getEquipment().getStatus().equals(EquipmentEntity.Status.AVAILABLE) == false) {
                attributes.addFlashAttribute("fail", true);
                model.addAttribute("errorMessage", "Status Not Match");
                model.addAttribute("transaction", hiringTransactionService.findById(hiringTransactionEntity.getId()));
                return "hiring_transaction/detail";
            }
        }

        if (foundHiringTransaction.getStatus().equals(HiringTransactionEntity.Status.PROCESSING)) {
            if (hiringTransactionEntity.getEquipment().getStatus().equals(EquipmentEntity.Status.DELIVERING) == false
                    && hiringTransactionEntity.getEquipment().getStatus().equals(EquipmentEntity.Status.RENTING) == false
                    && hiringTransactionEntity.getEquipment().getStatus().equals(EquipmentEntity.Status.WAITING_FOR_RETURNING) == false
            ) {
                model.addAttribute("errorMessage", "Status Not Match");
                model.addAttribute("transaction", hiringTransactionService.findById(hiringTransactionEntity.getId()));
                return "hiring_transaction/detail";
            }
        }


        EquipmentEntity foundEquipment = foundHiringTransaction.getEquipment();
        foundEquipment.setStatus(hiringTransactionEntity.getEquipment().getStatus());
        equipmentService.save(foundEquipment);
        hiringTransactionService.save(foundHiringTransaction);
        Integer id = foundHiringTransaction.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {

        hiringTransactionService.deleteById(id);
        return "redirect:index";
    }


}
