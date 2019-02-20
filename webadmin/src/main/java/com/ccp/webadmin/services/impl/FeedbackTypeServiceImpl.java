package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.FeedbackTypeRepository;
import com.ccp.webadmin.repositories.GeneralEquipmentTypeRepository;
import com.ccp.webadmin.services.FeedbackTypeService;
import com.ccp.webadmin.services.GeneralEquipmentTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackTypeServiceImpl implements FeedbackTypeService {

    private final FeedbackTypeRepository feedbackTypeRepository;

    @Autowired
    public FeedbackTypeServiceImpl(FeedbackTypeRepository feedbackTypeRepository) {
        this.feedbackTypeRepository = feedbackTypeRepository;
    }

    @Override
    public List<FeedbackTypeEntity> findAll() {
        return feedbackTypeRepository.findAll();
    }

    @Override
    public FeedbackTypeEntity findById(Integer id) {
        return feedbackTypeRepository.findById(id).get();
    }

    @Override
    public void save(FeedbackTypeEntity feedbackTypeEntity) {
        feedbackTypeRepository.save(feedbackTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        feedbackTypeRepository.deleteById(id);
    }
}
