package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface HiringTransactionService {

    List<HiringTransactionEntity> findAll();

    HiringTransactionEntity findById(Integer id);

    void save(HiringTransactionEntity hiringTransactionEntity);

    void deleteById(Integer id);

}
