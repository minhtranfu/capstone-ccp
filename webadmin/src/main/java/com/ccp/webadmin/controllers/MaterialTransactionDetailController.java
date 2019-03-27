package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.MaterialTransactionDetailEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import com.ccp.webadmin.entities.NotificationDeviceTokenEntity;
import com.ccp.webadmin.services.MaterialService;
import com.ccp.webadmin.services.MaterialTransactionDetailService;
import com.ccp.webadmin.services.MaterialTransactionService;
import com.ccp.webadmin.services.NotificationDeviceTokenService;
import com.ccp.webadmin.utils.PushNotifictionHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("material_transaction_detail")
public class MaterialTransactionDetailController {

    private final MaterialTransactionDetailService materialTransactionDetailService;
    private final MaterialService materialService;
    private final PushNotifictionHelper pushNotifictionHelper;
    private final NotificationDeviceTokenService notificationDeviceTokenService;

    @Autowired
    public MaterialTransactionDetailController(MaterialTransactionDetailService materialTransactionDetailService, MaterialService materialService, PushNotifictionHelper pushNotifictionHelper, NotificationDeviceTokenService notificationDeviceTokenService) {
        this.materialTransactionDetailService = materialTransactionDetailService;
        this.materialService = materialService;
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("transactions", materialTransactionDetailService.findAll());
        return "material_transaction_detail/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("transaction", materialTransactionDetailService.findById(id));
        model.addAttribute("transactionStatus", Arrays.asList(MaterialTransactionEntity.Status.values()));

        return "material_transaction_detail/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("transaction", new MaterialTransactionDetailEntity());
        model.addAttribute("errorMessage", "");
        return "material_transaction_detail/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("transaction") MaterialTransactionDetailEntity materialTransactionDetailEntity,
//            @ModelAttribute("errorMessage") String error,
            BindingResult bindingResult, Model model, RedirectAttributes attributes) {

        model.addAttribute("transactionStatus", Arrays.asList(MaterialTransactionEntity.Status.values()));
        MaterialTransactionDetailEntity foundMaterialDetailTransaction = materialTransactionDetailService.findById(materialTransactionDetailEntity.getId());

        // TODO: 2019-02-26 set attributes
//        foundMaterialTransaction.setStatus(materialTransactionEntity.getStatus());
//        if (!foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.PENDING)
//                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.DELIVERVING)
//                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.ACCEPTED)
//                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.DENIED)
//                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.FINISHED)
//                && !foundMaterialTransaction.getStatus().equals(MaterialTransactionEntity.Status.CANCELED)
//        ) {
//            model.addAttribute("errorMessage", "Status Not Match");
//            model.addAttribute("transaction", materialTransactionService.findById(materialTransactionEntity.getId()));
//            return "material_transaction/detail";
//        }




        Integer id = foundMaterialDetailTransaction.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        materialTransactionDetailService.deleteById(id);
        return "redirect:index";
    }


}
