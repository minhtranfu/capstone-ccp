package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.GeneralEquipmentTypeEntity;
import com.ccp.webadmin.repositories.EquipmentTypeRepository;
import com.ccp.webadmin.repositories.FeedbackRepository;
import com.ccp.webadmin.services.EquipmentTypeService;
import com.ccp.webadmin.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;

    @Autowired
    public FeedbackServiceImpl(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

//    @Override
//    public boolean existsEquipmentTypeByGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentTypeEntity) {
//        return feedbackRepository.existsEquipmentTypeEntitiesByGeneralEquipmentType(generalEquipmentTypeEntity);
//    }
//
//    @Override
//    public boolean existsEquipmentTypeByGeneralEquipmentType(FeedbackTypeEntity feedbackTypeEntity) {
//        return feed.;
//    }


    @Override
    public List<FeedbackEntity> findAll() {
        return feedbackRepository.findAll();
    }

    @Override
    public List<FeedbackEntity> findByFeedbackEntities(FeedbackTypeEntity feedbackTypeEntity) {
        return feedbackRepository.findAllByFeedbackTypeEntity(feedbackTypeEntity);
    }

    @Override
    public FeedbackEntity findById(Integer id) {
        return feedbackRepository.findById(id).get();
    }

    @Override
    public void save(FeedbackEntity feedbackEntity) {
        feedbackRepository.save(feedbackEntity);
    }


    @Override
    public void deleteById(Integer id) {
        feedbackRepository.deleteById(id);
    }
}
