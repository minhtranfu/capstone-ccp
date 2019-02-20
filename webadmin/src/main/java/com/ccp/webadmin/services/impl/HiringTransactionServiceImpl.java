package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.repositories.FeedbackTypeRepository;
import com.ccp.webadmin.repositories.HiringTransactionRepository;
import com.ccp.webadmin.services.FeedbackTypeService;
import com.ccp.webadmin.services.HiringTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
