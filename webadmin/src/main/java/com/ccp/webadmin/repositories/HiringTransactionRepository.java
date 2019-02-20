package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HiringTransactionRepository extends JpaRepository<HiringTransactionEntity, Integer> {
}
