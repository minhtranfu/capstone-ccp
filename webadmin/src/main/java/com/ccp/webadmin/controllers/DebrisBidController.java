package com.ccp.webadmin.controllers;

import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.DebrisPostEntity;
import com.ccp.webadmin.entities.DebrisServiceTypeEntity;
import com.ccp.webadmin.services.DebrisBidService;
import com.ccp.webadmin.services.DebrisImageService;
import com.ccp.webadmin.services.DebrisPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@Controller
@RequestMapping("debris_bid")
public class DebrisBidController {

    private final DebrisBidService debrisBidService;

    @Autowired
    public DebrisBidController(DebrisBidService debrisBidService) {
        this.debrisBidService = debrisBidService;
    }

    @GetMapping("/detail/{id}/transactionId/{transactionId}")
    public String detail(@PathVariable("id") Integer id,
                         @PathVariable("transactionId") Integer transactionId,
                         Model model) {
        DebrisBidEntity debrisBidEntity = debrisBidService.findById(id);
        model.addAttribute("debrisBid", debrisBidEntity);
        model.addAttribute("debrisTransactionId", transactionId);
        return "debris_bid/detail";
    }

    @PostMapping("/saveProcess")
    public String saveProcess(
            @Valid @ModelAttribute("debrisBid") DebrisBidEntity debrisBidEntity,
            Model model) {

        return "redirect:detail/";
    }


}
