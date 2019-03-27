package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.StaffDTO;
import com.ccp.webadmin.dtos.StatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.services.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/report")
public class StatisticController {

    private final ContractorService contractorService;
    private final HiringTransactionService hiringTransactionService;
    private final ReportService reportService;
    private final EquipmentService equipmentService;
    private final MaterialService materialService;

    @Autowired
    public StatisticController(ContractorService contractorService, HiringTransactionService hiringTransactionService, ReportService reportService, EquipmentService equipmentService, MaterialService materialService) {
        this.contractorService = contractorService;
        this.hiringTransactionService = hiringTransactionService;
        this.reportService = reportService;
        this.equipmentService = equipmentService;
        this.materialService = materialService;
    }

    @GetMapping("/hiringTransacton")
    public List<StatisticHiringTransactionDTO> home(
//            @RequestParam(value = "byType") String byType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = dateTimeFormat(beginDateString);
        LocalDateTime endDate = dateTimeFormat(endDateString);
        String byType = "month";
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<StatisticHiringTransactionDTO>();
        statisticHiringTransactionDTOS = hiringTransactionService.statisticHiringTransaction(byType, beginDate, endDate);
        return statisticHiringTransactionDTOS;
    }

    @GetMapping("/equipment")
    public StatisticDTO statisticEquipment(
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {

        LocalDateTime beginDate = dateTimeFormat(beginDateString);
        LocalDateTime endDate = dateTimeFormat(endDateString);
        StatisticDTO statisticDTO = new StatisticDTO();
        statisticDTO.setEquipment(equipmentService.countEquipment(beginDate, endDate));
        statisticDTO.setMaterial(materialService.countMaterial(beginDate, endDate));
        return statisticDTO;
    }

    public LocalDateTime dateTimeFormat(String dateString) {
        dateString = dateString + " 00:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        LocalDateTime dateTime = LocalDateTime.parse(dateString, formatter);
        return dateTime;
    }

}
