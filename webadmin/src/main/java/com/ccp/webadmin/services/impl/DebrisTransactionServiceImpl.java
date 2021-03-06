package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.DebrisTransactionEntity;
import com.ccp.webadmin.repositories.DebrisTransactionRepository;
import com.ccp.webadmin.services.DebrisTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class DebrisTransactionServiceImpl implements DebrisTransactionService {

    private final DebrisTransactionRepository debrisTransactionRepository;

    @Autowired
    public DebrisTransactionServiceImpl(DebrisTransactionRepository debrisTransactionRepository) {
        this.debrisTransactionRepository = debrisTransactionRepository;
    }

    @Override
    public List<DebrisTransactionEntity> findAll() {
        return debrisTransactionRepository.findAll();
    }

    @Override
    public DebrisTransactionEntity findById(Integer id) {
        return debrisTransactionRepository.findById(id).get();
    }

    @Override
    public void save(DebrisTransactionEntity debrisTransactionEntity) {
        debrisTransactionRepository.save(debrisTransactionEntity);
    }

    @Override
    public void deleteById(Integer id) {
        debrisTransactionRepository.deleteById(id);
    }

    @Override
    public List<StatisticHiringTransactionDTO> statisticDebrisTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<StatisticHiringTransactionDTO> statisticHiringTransactionDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                statisticHiringTransactionDTOS = debrisTransactionRepository.countStatisticByYear(beginDate,endDate);
                break;
            case "month":
                statisticHiringTransactionDTOS = debrisTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
            case "week":
                statisticHiringTransactionDTOS = debrisTransactionRepository.countStatisticByWeek(beginDate,endDate);
                break;
            default:
                statisticHiringTransactionDTOS = debrisTransactionRepository.countStatisticByMonth(beginDate,endDate);
                break;
        }
        return statisticHiringTransactionDTOS;
    }

    @Override
    public List<LineChartStatisticDTO> statisticTotalDebrisTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate) {
        List<LineChartStatisticDTO> lineChartStatisticDTOS = new ArrayList<>();
        switch (byType) {
            case "year":
                lineChartStatisticDTOS = debrisTransactionRepository.countTotalTransactionByYear(beginDate,endDate);
                break;
            case "month":
                lineChartStatisticDTOS = debrisTransactionRepository.countTotalTransactionByMonth(beginDate,endDate);
                break;
            case "week":
                lineChartStatisticDTOS = debrisTransactionRepository.countTotalTransactionByWeek(beginDate,endDate);
                break;
            default:
                lineChartStatisticDTOS = debrisTransactionRepository.countTotalTransactionByWeek(beginDate,endDate);
                break;
        }
        return lineChartStatisticDTOS;

    }

    @Override
    public Integer countDebrisTransactionIncome() {
        return debrisTransactionRepository.countDebrisTransactionIncome();
    }
}
