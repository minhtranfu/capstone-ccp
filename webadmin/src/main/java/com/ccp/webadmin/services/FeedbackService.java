package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FeedbackService {
//    boolean ex(FeedbackTypeEntity feedbackTypeEntity);

    List<FeedbackEntity> findAll();

    List<FeedbackEntity> findByFeedbackEntities(FeedbackTypeEntity feedbackTypeEntity);

    FeedbackEntity findById(Integer id);

    void save(FeedbackEntity feedbackEntity);

    void deleteById(Integer id);

    Integer countFeedbackByContractor(ContractorEntity contractor);

}
