package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.*;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public interface EquipmentService {
    List<EquipmentEntity> findAll();

    List<EquipmentEntity> findByEquipmentType(EquipmentTypeEntity equipmentTypeEntity);

    EquipmentEntity findById(Integer id);

    void save(EquipmentEntity equipmentEntity);

    void deleteById(Integer id);

    Integer countEquipment(LocalDateTime beginDate, LocalDateTime endDate);

}
