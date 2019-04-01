package com.ccp.webadmin.services;

import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public interface MaterialTransactionService {

    List<MaterialTransactionEntity> findAll();

    MaterialTransactionEntity findById(Integer id);

    void save(MaterialTransactionEntity materialTransactionEntity);

    void deleteById(Integer id);

    List<StatisticHiringTransactionDTO> statisticMaterialTransaction(String byType, LocalDateTime beginDate, LocalDateTime endDate);

}
