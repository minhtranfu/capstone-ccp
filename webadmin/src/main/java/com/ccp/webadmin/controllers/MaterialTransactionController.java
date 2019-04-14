package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.entities.NotificationEntity;
import com.ccp.webadmin.services.*;
import com.ccp.webadmin.utils.PushNotifictionHelper;
import com.ccp.webadmin.utils.SendNotificationForTransaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("material_transaction")
public class MaterialTransactionController {

    private final MaterialTransactionService materialTransactionService;
    private final MaterialTransactionDetailService materialTransactionDetailService;
    private final MaterialService materialService;
    private final SendNotificationForTransaction sendNotificationForTransaction;

    @Autowired
    public MaterialTransactionController(MaterialTransactionService materialTransactionService, MaterialTransactionDetailService materialTransactionDetailService, MaterialService materialService, SendNotificationForTransaction sendNotificationForTransaction) {
        this.materialTransactionService = materialTransactionService;
        this.materialTransactionDetailService = materialTransactionDetailService;
        this.materialService = materialService;
        this.sendNotificationForTransaction = sendNotificationForTransaction;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("transactions", materialTransactionService.findAll());
        return "material_transaction/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        MaterialTransactionEntity materialTransactionEntity = materialTransactionService.findById(id);
        model.addAttribute("transaction", materialTransactionEntity);
        model.addAttribute("transactionStatus", Arrays.asList(MaterialTransactionEntity.Status.values()));
        model.addAttribute("transactionDetails", materialTransactionDetailService.findAllByMaterialTransactionEntity(materialTransactionEntity));

        return "material_transaction/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("transaction", new MaterialTransactionEntity());
        model.addAttribute("errorMessage", "");
        return "material_transaction/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("transaction") MaterialTransactionEntity materialTransactionEntity,
            BindingResult bindingResult, Model model, RedirectAttributes attributes) {

        model.addAttribute("transactionStatus", Arrays.asList(MaterialTransactionEntity.Status.values()));
        MaterialTransactionEntity foundMaterialTransaction = materialTransactionService.findById(materialTransactionEntity.getId());

        // TODO: 2019-02-26 set attributes
        foundMaterialTransaction.setStatus(materialTransactionEntity.getStatus());
        if (!foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.PENDING)
                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.DELIVERVING)
                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.ACCEPTED)
                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.DENIED)
                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.FINISHED)
                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.CANCELED)
        ) {
            model.addAttribute("errorMessage", "Status Not Match");
            model.addAttribute("transaction", materialTransactionService.findById(materialTransactionEntity.getId()));
            return "material_transaction/detail";
        }

        materialTransactionService.save(foundMaterialTransaction);
        String title = "Change Buying Material Transaction Status";
        String content = "Buying Material Transaction Status: " + foundMaterialTransaction.getStatus().getValue();
        String clickAction = "materialTransations/" + foundMaterialTransaction.getId();
        ContractorEntity supplier = foundMaterialTransaction.getSupplier();
        ContractorEntity requester = foundMaterialTransaction.getRequester();
        sendNotificationForTransaction.sendNotificationForTransaction(title, content, clickAction, supplier, requester);
        Integer id = foundMaterialTransaction.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        materialTransactionService.deleteById(id);
        return "redirect:index";
    }


}
