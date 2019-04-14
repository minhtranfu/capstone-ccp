package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.services.DebrisBidService;
import com.ccp.webadmin.services.DebrisImageService;
import com.ccp.webadmin.services.DebrisPostService;
import com.ccp.webadmin.services.DebrisTransactionService;
import com.ccp.webadmin.utils.SendNotificationForTransaction;
import lombok.val;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.validation.Valid;
import java.util.Arrays;

@Controller
@RequestMapping("debris_post")
public class DebrisPostController {

    private final DebrisPostService debrisPostService;
    private final DebrisImageService debrisImageService;

    @Autowired
    public DebrisPostController(DebrisPostService debrisPostService, DebrisImageService debrisImageService) {
        this.debrisPostService = debrisPostService;
        this.debrisImageService = debrisImageService;
    }

    @GetMapping("/detail/{id}/transactionId/{transactionId}")
    public String detail(@PathVariable("id") Integer id,
                         @PathVariable("transactionId") Integer transactionId,
                         Model model) {
        DebrisPostEntity debrisPostEntity = debrisPostService.findById(id);
        model.addAttribute("debrisPost", debrisPostEntity);
        model.addAttribute("debrisTransactionId", transactionId);
        model.addAttribute("debrisPostImages", debrisImageService.findByDebrisPostEntity(debrisPostEntity));
        for (DebrisServiceTypeEntity debrisServiceType : debrisPostEntity.getDebrisServiceTypes()) {
            System.out.println("aaa" +  debrisServiceType.getName());
            System.out.println("bbb" +  debrisServiceType.getId());
        }

        return "debris_post/detail";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("debrisPost") DebrisPostEntity debrisPostEntity,
            Model model) {

        return "redirect:detail/";
    }


}
