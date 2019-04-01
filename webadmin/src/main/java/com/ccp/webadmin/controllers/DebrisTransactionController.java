package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.services.*;
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
@RequestMapping("debris_transaction")
public class DebrisTransactionController {

    private final DebrisTransactionService debrisTransactionService;
    private final DebrisBidService debrisBidService;
    private final DebrisPostService debrisPostService;
    private final PushNotifictionHelper pushNotifictionHelper;
    private final NotificationDeviceTokenService notificationDeviceTokenService;

    @Autowired
    public DebrisTransactionController(DebrisTransactionService debrisTransactionService, DebrisBidService debrisBidService, DebrisPostService debrisPostService, PushNotifictionHelper pushNotifictionHelper, NotificationDeviceTokenService notificationDeviceTokenService) {
        this.debrisTransactionService = debrisTransactionService;
        this.debrisBidService = debrisBidService;
        this.debrisPostService = debrisPostService;
        this.pushNotifictionHelper = pushNotifictionHelper;
        this.notificationDeviceTokenService = notificationDeviceTokenService;
    }

    @GetMapping({"", "/", "/index"})
    public String getAll(Model model) {
        model.addAttribute("transactions", debrisTransactionService.findAll());
        return "debris_transaction/index";
    }

    @GetMapping("/detail/{id}")
    public String detail(@PathVariable("id") Integer id, Model model) {
        model.addAttribute("transaction", debrisTransactionService.findById(id));
        model.addAttribute("transactionStatus", Arrays.asList(DebrisTransactionEntity.Status.values()));
        model.addAttribute("debrisPostStatus", Arrays.asList(DebrisPostEntity.Status.values()));
        model.addAttribute("debrisBidStatus", Arrays.asList(DebrisBidEntity.Status.values()));
        return "debris_transaction/detail";
    }

    @GetMapping("/create")
    public String create(Model model) {
        model.addAttribute("transaction", new DebrisTransactionEntity());
        model.addAttribute("errorMessage", "");
        return "debris_transaction/create";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("transaction") DebrisTransactionEntity debrisTransactionEntity,
//            @ModelAttribute("errorMessage") String error,
            BindingResult bindingResult, Model model, RedirectAttributes attributes) {
        model.addAttribute("transactionStatus", Arrays.asList(DebrisTransactionEntity.Status.values()));
        model.addAttribute("debrisPostStatus", Arrays.asList(DebrisPostEntity.Status.values()));
        model.addAttribute("debrisBidStatus", Arrays.asList(DebrisBidEntity.Status.values()));
        DebrisTransactionEntity foundDebrisTransaction = debrisTransactionService.findById(debrisTransactionEntity.getId());

        // TODO: 2019-02-26 set attributes
        foundDebrisTransaction.setStatus(debrisTransactionEntity.getStatus());
        if (foundDebrisTransaction.getStatus().equals(DebrisTransactionEntity.Status.ACCEPTED)
                || foundDebrisTransaction.getStatus().equals(DebrisTransactionEntity.Status.DELIVERING)
                || foundDebrisTransaction.getStatus().equals(DebrisTransactionEntity.Status.WORKING)
        ) {
            if (debrisTransactionEntity.getDebrisBidEntity().getStatus().equals(DebrisBidEntity.Status.ACCEPTED) == false ||
                    debrisTransactionEntity.getDebrisBidEntity().getDebrisPostEntity().getStatus().equals(DebrisPostEntity.Status.ACCEPTED) == false) {
                model.addAttribute("errorMessage", "Status Not Match");
                model.addAttribute("transaction", debrisTransactionService.findById(debrisTransactionEntity.getId()));
                model.addAttribute("transactionStatus", Arrays.asList(DebrisTransactionEntity.Status.values()));
                model.addAttribute("debrisPostStatus", Arrays.asList(DebrisPostEntity.Status.values()));
                model.addAttribute("debrisBidStatus", Arrays.asList(DebrisBidEntity.Status.values()));
                return "debris_transaction/detail";
            }
        }

        if (foundDebrisTransaction.getStatus().equals(DebrisTransactionEntity.Status.FINISHED)) {
            if (debrisTransactionEntity.getDebrisBidEntity().getStatus().equals(DebrisBidEntity.Status.FINISHED) == false ||
                    debrisTransactionEntity.getDebrisBidEntity().getDebrisPostEntity().getStatus().equals(DebrisPostEntity.Status.FINISHED) == false) {
                model.addAttribute("errorMessage", "Status Not Match");
                model.addAttribute("transaction", debrisTransactionService.findById(debrisTransactionEntity.getId()));
                model.addAttribute("transactionStatus", Arrays.asList(DebrisTransactionEntity.Status.values()));
                model.addAttribute("debrisPostStatus", Arrays.asList(DebrisPostEntity.Status.values()));
                model.addAttribute("debrisBidStatus", Arrays.asList(DebrisBidEntity.Status.values()));
                return "debris_transaction/detail";
            }
        }

        if (foundDebrisTransaction.getStatus().equals(DebrisTransactionEntity.Status.CANCELED)) {
            if (debrisTransactionEntity.getDebrisBidEntity().getStatus().equals(DebrisBidEntity.Status.PENDING) == false ||
                    debrisTransactionEntity.getDebrisBidEntity().getDebrisPostEntity().getStatus().equals(DebrisPostEntity.Status.PENDING) == false) {
                model.addAttribute("errorMessage", "Status Not Match");
                model.addAttribute("transaction", debrisTransactionService.findById(debrisTransactionEntity.getId()));
                model.addAttribute("transactionStatus", Arrays.asList(DebrisTransactionEntity.Status.values()));
                model.addAttribute("debrisPostStatus", Arrays.asList(DebrisPostEntity.Status.values()));
                model.addAttribute("debrisBidStatus", Arrays.asList(DebrisBidEntity.Status.values()));
                return "debris_transaction/detail";
            }
        }

        DebrisBidEntity foundDebrisBid = foundDebrisTransaction.getDebrisBidEntity();
        foundDebrisBid.setStatus(debrisTransactionEntity.getDebrisBidEntity().getStatus());
        DebrisPostEntity foundDebrisPost = foundDebrisBid.getDebrisPostEntity();
        foundDebrisPost.setStatus(debrisTransactionEntity.getDebrisBidEntity().getDebrisPostEntity().getStatus());
        debrisBidService.save(foundDebrisBid);
        debrisTransactionService.save(foundDebrisTransaction);
        String title = "Change Hiring Transaction Status";
        String content = "Debris Transaction Status: " + foundDebrisTransaction.getStatus().getValue()
                + " Debris Bid Status: " + foundDebrisBid.getStatus().getValue()
                + " Debris Post Status: " + foundDebrisBid.getDebrisPostEntity().getStatus().getValue();
        try {
            //send notification to supplier
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(foundDebrisTransaction.getDebrisBidEntity().getSupplier())
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content);
            }

            // send notification to requester
            for (NotificationDeviceTokenEntity notificationDeviceTokenEntity : notificationDeviceTokenService.findByContractor(foundDebrisTransaction.getDebrisBidEntity().getDebrisPostEntity().getRequester())
            ) {
                pushNotifictionHelper.pushFCMNotification(notificationDeviceTokenEntity.getRegistrationToken(), title, content);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        Integer id = foundDebrisTransaction.getId();
        return "redirect:detail/" + id;
    }

    @GetMapping("/delete")
    public String delete(@RequestParam("id") Integer id) {
        debrisTransactionService.deleteById(id);
        return "redirect:index";
    }


}
