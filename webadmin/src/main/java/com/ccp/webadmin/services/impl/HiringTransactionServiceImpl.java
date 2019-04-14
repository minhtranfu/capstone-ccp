package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.repositories.HiringTransactionRepository;
import com.ccp.webadmin.services.HiringTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class HiringTransactionServiceImpl implements HiringTransactionService {

    private final HiringTransactionRepository hiringTransactionRepository;

    @Autowired
    public HiringTransactionServiceImpl(HiringTransactionRepository hiringTransactionRepository) {
        this.hiringTransactionRepository = hiringTransactionRepository;
    }

    @Override
    public List<HiringTransactionEntity> findAll() {
        return hiringTransactionRepository.findAll();
    }

    @Override
    public HiringTransactionEntity findById(Integer id) {
        return hiringTransactionRepository.findById(id).get();
    }

    @Override
    public void save(HiringTransactionEntity hiringTransactionEntity) {
        hiringTransactionRepository.save(hiringTransactionEntity);
    }

    @Override
    public void deleteById(Integer id) {
        hiringTransactionRepository.deleteById(id);
    }

    @Override
    public List<StatisticHiringTransactionDTO> statisticHiringTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByYear(beginDate,endDate);
                break;
            case "month":
                statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
            case "week":
                statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByWeek(beginDate,endDate);
                break;
            default:
                statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
        }
        return statisticHiringTransactionDTOS;
    }

    @Override
    public List<LineChartStatisticDTO> statisticTotalTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalHiringTransactionByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalHiringTransactionByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalHiringTransactionByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalHiringTransactionByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

    @Override
    public List<LineChartStatisticDTO> statisticTotalPrice(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalPriceHiringTransactionByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalPriceHiringTransactionByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalPriceHiringTransactionByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = hiringTransactionRepository.countTotalPriceHiringTransactionByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;
    }

    @Override
    public Integer countHiringTransactionIncome() {
        return hiringTransactionRepository.countHiringTransactionIncome();
    }
}
