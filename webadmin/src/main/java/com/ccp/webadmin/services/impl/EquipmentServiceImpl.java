package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.repositories.EquipmentRepository;
import com.ccp.webadmin.services.EquipmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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

    @Override
    public List<EquipmentEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity) {
        return equipmentRepository.findByEquipmentTypeEntity(equipmentTypeEntity);
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

    @Override
    public Integer countEquipment(LocalDateTime beginDate, LocalDateTime endDate) {
        return equipmentRepository.countEquipment(beginDate, endDate);
    }


}
