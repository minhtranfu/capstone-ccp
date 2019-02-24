package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.FeedbackEntity;
import com.ccp.webadmin.entities.FeedbackTypeEntity;
import com.ccp.webadmin.repositories.EquipmentRepository;
import com.ccp.webadmin.repositories.FeedbackRepository;
import com.ccp.webadmin.services.EquipmentService;
import com.ccp.webadmin.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;

    @Autowired
    public EquipmentServiceImpl(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }


    @Override
    public List<EquipmentEntity> findAll() {
        return equipmentRepository.findAll();
    }


    public EquipmentEntity findById(Integer id) {
        return equipmentRepository.findById(id).get();
    }

    @Override
    public void save(EquipmentEntity equipmentEntity) {
        equipmentRepository.save(equipmentEntity);
    }


    @Override
    public void deleteById(Integer id) {
        equipmentRepository.deleteById(id);
    }



}
