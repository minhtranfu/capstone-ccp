package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MaterialRepository extends JpaRepository<MaterialEntity, Integer> {
    List<MaterialEntity> findByMaterialTypeEntity(MaterialTypeEntity materialTypeEntity);

    @Query("select count(e) from MaterialEntity e where e.updatedTime between :beginDate and :endDate")
    Integer countMaterial(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
