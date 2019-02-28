package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.services.FeedbackTypeService;
import com.ccp.webadmin.services.HiringTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("hiring_transaction")
public class HiringTransactionController {

    private final HiringTransactionService hiringTransactionService;

    @Autowired
    public HiringTransactionController(HiringTransactionService hiringTransactionService) {
        this.hiringTransactionService = hiringTransactionService;
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
        return "hiring_transaction/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("transaction", new HiringTransactionEntity());
        return "hiring_transaction/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("transaction") HiringTransactionEntity hiringTransactionEntity,
            BindingResult bindingResult, Model model) {

        model.addAttribute("transactionStatus", Arrays.asList(HiringTransactionEntity.Status.values()));
        HiringTransactionEntity foundHiringTransaction = hiringTransactionService.findById(hiringTransactionEntity.getId());

        // TODO: 2019-02-26 set attributes
        foundHiringTransaction.setStatus(hiringTransactionEntity.getStatus());


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
