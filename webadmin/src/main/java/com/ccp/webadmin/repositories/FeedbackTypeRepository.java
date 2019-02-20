package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdditionalSpecialFieldEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackTypeRepository extends JpaRepository<FeedbackTypeEntity, Integer> {
}
