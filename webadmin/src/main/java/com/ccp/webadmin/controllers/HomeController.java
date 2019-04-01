package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("home")
public class HomeController {

    private final ContractorService contractorService;
    private final HiringTransactionService hiringTransactionService;
    private final ReportService reportService;
    private final EquipmentService equipmentService;
    private final MaterialService materialService;

    @Autowired
    public HomeController(ContractorService contractorService, HiringTransactionService hiringTransactionService, ReportService reportService, EquipmentService equipmentService, MaterialService materialService) {
        this.contractorService = contractorService;
        this.hiringTransactionService = hiringTransactionService;
        this.reportService = reportService;
        this.equipmentService = equipmentService;
        this.materialService = materialService;
    }

    @GetMapping({"", "/", "index"})
    public String home(Model model) {
        model.addAttribute("newContractor", contractorService.countNewContractor());
        model.addAttribute("newFeedback", reportService.countNewReport());


        return "home/index";
    }


}
