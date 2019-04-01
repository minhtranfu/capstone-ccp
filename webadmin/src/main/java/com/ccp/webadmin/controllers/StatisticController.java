package com.ccp.webadmin.controllers;

import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
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
    private final MaterialTransactionService materialTransactionService;

    @Autowired
    public StatisticController(ContractorService contractorService, HiringTransactionService hiringTransactionService, ReportService reportService, EquipmentService equipmentService, MaterialService materialService, MaterialTransactionService materialTransactionService) {
        this.contractorService = contractorService;
        this.hiringTransactionService = hiringTransactionService;
        this.reportService = reportService;
        this.equipmentService = equipmentService;
        this.materialService = materialService;
        this.materialTransactionService = materialTransactionService;
    }

    // STATISTIC for equipment
    // Equipment Transaction
    @GetMapping("/hiringTransacton")
    public List<StatisticHiringTransactionDTO> hiringTransaction(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<StatisticHiringTransactionDTO>();
        statisticHiringTransactionDTOS = hiringTransactionService.statisticHiringTransaction(selectType, beginDate, endDate);
        return statisticHiringTransactionDTOS;
    }

    // Equipment Type
    @GetMapping("/equipmentType")
    public List<PieChartStatisticDTO> equipmentType(
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<PieChartStatisticDTO> pieChartStatisticDTOs = new ArrayList<>();
        pieChartStatisticDTOs = equipmentService.countEquipmentByEquipmentType(beginDate, endDate);
        return pieChartStatisticDTOs;
    }

    // Equipment
    @GetMapping("/equipment")
    public List<LineChartStatisticDTO> equipment(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        lineChartStatisticDTOS = equipmentService.countEquipment(selectType, beginDate, endDate);
        return lineChartStatisticDTOS;
    }

    //  Total Equipment Transaction
    @GetMapping("/equipmentTotalTransaction")
    public List<LineChartStatisticDTO> equipmentTotalTransaction(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        lineChartStatisticDTOS = hiringTransactionService.statisticTotalTransaction(selectType, beginDate, endDate);
        return lineChartStatisticDTOS;
    }

    //  Total Equipment Price Transaction
    @GetMapping("/equipmentTotalPriceTransaction")
    public List<LineChartStatisticDTO> equipmentTotalPriceTransaction(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        lineChartStatisticDTOS = hiringTransactionService.statisticTotalPrice(selectType, beginDate, endDate);
        return lineChartStatisticDTOS;
    }

    // STATISTIC for material
    // Material Transaction
    @GetMapping("/materialTransacton")
    public List<StatisticHiringTransactionDTO> materialTransaction(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<StatisticHiringTransactionDTO>();
        statisticHiringTransactionDTOS = materialTransactionService.statisticMaterialTransaction(selectType, beginDate, endDate);
        return statisticHiringTransactionDTOS;
    }

    // Material Type
    @GetMapping("/materialType")
    public List<PieChartStatisticDTO> materialType(
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<PieChartStatisticDTO> pieChartStatisticDTOs = new ArrayList<>();
        pieChartStatisticDTOs = materialService.countMaterialByMaterialType(beginDate, endDate);
        return pieChartStatisticDTOs;
    }

    // Material
    @GetMapping("/material")
    public List<LineChartStatisticDTO> material(
            @RequestParam(value = "selectType") String selectType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        lineChartStatisticDTOS = materialService.countMaterial(selectType, beginDate, endDate);
        return lineChartStatisticDTOS;
    }


    // format datetime
    public LocalDateTime beginDateTimeFormat(String dateString) {
        dateString = dateString + " 00:00:00";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        LocalDateTime dateTime = LocalDateTime.parse(dateString, formatter);
        return dateTime;
    }

    public LocalDateTime endDateTimeFormat(String dateString) {
        dateString = dateString + " 23:59:59";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
        LocalDateTime dateTime = LocalDateTime.parse(dateString, formatter);
        return dateTime;
    }

    @GetMapping("/hiringTransacton/year")
    public List<StatisticHiringTransactionDTO> year(
//            @RequestParam(value = "byType") String byType,
            @RequestParam(value = "beginDate") String beginDateString,
            @RequestParam(value = "endDate") String endDateString) {
        LocalDateTime beginDate = beginDateTimeFormat(beginDateString);
        LocalDateTime endDate = endDateTimeFormat(endDateString);
        String byType = "year";
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<StatisticHiringTransactionDTO>();
        statisticHiringTransactionDTOS = hiringTransactionService.statisticHiringTransaction(byType, beginDate, endDate);
        return statisticHiringTransactionDTOS;
    }

}
