package com.ccp.webadmin.services.impl;

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
        if(byType.equals("year")){
            statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByYear(beginDate,endDate);
        }
        if(byType.equals("month")){
            statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByYear(beginDate,endDate);
        }
        if(byType.equals("week")){
            statisticHiringTransactionDTOS = hiringTransactionRepository.countStatisticByYear(beginDate,endDate);
        }
        return statisticHiringTransactionDTOS;
    }
}
