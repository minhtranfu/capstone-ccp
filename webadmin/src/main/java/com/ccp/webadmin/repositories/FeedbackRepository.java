package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<FeedbackEntity, Integer> {
    List<FeedbackEntity> findAllByFeedbackTypeEntity(FeedbackTypeEntity feedbackTypeEntity);
}
