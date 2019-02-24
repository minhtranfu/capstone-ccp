package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipmentRepository extends JpaRepository<EquipmentEntity, Integer> {
}
