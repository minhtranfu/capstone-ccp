package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import com.ccp.webadmin.repositories.HiringTransactionRepository;
import com.ccp.webadmin.repositories.MaterialTransactionRepository;
import com.ccp.webadmin.services.HiringTransactionService;
import com.ccp.webadmin.services.MaterialTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class MaterialTransactionServiceImpl implements MaterialTransactionService {

    private final MaterialTransactionRepository materialTransactionRepository;

    @Autowired
    public MaterialTransactionServiceImpl(MaterialTransactionRepository materialTransactionRepository) {
        this.materialTransactionRepository = materialTransactionRepository;
    }

    @Override
    public List<MaterialTransactionEntity> findAll() {
        return materialTransactionRepository.findAll();
    }

    @Override
    public MaterialTransactionEntity findById(Integer id) {
        return materialTransactionRepository.findById(id).get();
    }

    @Override
    public void save(MaterialTransactionEntity materialTransactionEntity) {
        materialTransactionRepository.save(materialTransactionEntity);
    }

    @Override
    public void deleteById(Integer id) {
        materialTransactionRepository.deleteById(id);
    }

    @Override
    public List<StatisticHiringTransactionDTO> statisticMaterialTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                statisticHiringTransactionDTOS = materialTransactionRepository.countStatisticByYear(beginDate,endDate);
                break;
            case "month":
                statisticHiringTransactionDTOS = materialTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
            case "week":
                statisticHiringTransactionDTOS = materialTransactionRepository.countStatisticByWeek(beginDate,endDate);
                break;
            default:
                statisticHiringTransactionDTOS = materialTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
        }
        return statisticHiringTransactionDTOS;
    }

    @Override
    public List<LineChartStatisticDTO> statisticTotalMaterialTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalTransactionByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalTransactionByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalTransactionByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = materialTransactionRepository.countTotalTransactionByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

    @Override
    public List<LineChartStatisticDTO> statisticTotalMaterialPrice(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalPriceTransactionByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalPriceTransactionByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = materialTransactionRepository.countTotalPriceTransactionByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = materialTransactionRepository.countTotalPriceTransactionByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }
}
