package com.ccp.webadmin.services.impl;

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
}
