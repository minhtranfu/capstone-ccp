package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.apache.tomcat.jni.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public interface MaterialService {
    List<MaterialEntity> findAll();

    List<MaterialEntity> findByMaterialType(MaterialTypeEntity materialTypeEntity);

    MaterialEntity findById(Integer id);

    void save(MaterialEntity materialEntity);

    void deleteById(Integer id);

    Integer countMaterial(LocalDateTime beginDate, LocalDateTime endDate);

}
