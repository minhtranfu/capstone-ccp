package com.ccp.webadmin.services;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface HiringTransactionService {

    List<HiringTransactionEntity> findAll();

    HiringTransactionEntity findById(Integer id);

    void save(HiringTransactionEntity hiringTransactionEntity);

    void deleteById(Integer id);

    List<StatisticHiringTransactionDTO> statisticHiringTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate);

    List<LineChartStatisticDTO> statisticTotalTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate);

    List<LineChartStatisticDTO> statisticTotalPrice(String byType, LocalDateTime beginDate, LocalDateTime endDate);

}
