package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface EquipmentRepository extends JpaRepository<EquipmentEntity, Integer> {
    List<EquipmentEntity> findByEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity);

//    @Query("select count(e) from EquipmentEntity e where e.creationDateTime between fromDate and toDate")
//    Integer countEquipmentEntityByCreatedTime_Date(Date fromDate, Date toDate);

    @Query("select count(e) from EquipmentEntity e where e.updatedTime between :beginDate and :endDate")
    Integer countEquipment(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
