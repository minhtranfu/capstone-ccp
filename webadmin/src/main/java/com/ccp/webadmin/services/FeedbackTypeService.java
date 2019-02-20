package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface FeedbackTypeService {
    List<FeedbackTypeEntity> findAll();

    FeedbackTypeEntity findById(Integer id);

    void save(FeedbackTypeEntity feedbackTypeEntity);

    void deleteById(Integer id);
}
