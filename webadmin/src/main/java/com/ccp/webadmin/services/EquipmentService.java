package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EquipmentService {
    List<EquipmentEntity> findAll();

    EquipmentEntity findById(Integer id);

    void save(EquipmentEntity equipmentEntity);

    void deleteById(Integer id);

}
