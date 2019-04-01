package com.ccp.webadmin.services;

import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.DebrisTransactionEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface DebrisTransactionService {

    List<DebrisTransactionEntity> findAll();

    DebrisTransactionEntity findById(Integer id);

    void save(DebrisTransactionEntity hiringTransactionEntity);

    void deleteById(Integer id);

    List<StatisticHiringTransactionDTO> statisticTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate);
}
