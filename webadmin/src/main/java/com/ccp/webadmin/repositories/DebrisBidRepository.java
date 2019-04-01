package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.DebrisBidEntity;
import com.ccp.webadmin.entities.EquipmentEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DebrisBidRepository extends JpaRepository<DebrisBidEntity, Integer> {

//    @Query("select count(e) from EquipmentEntity e where e.creationDateTime between fromDate and toDate")
//    Integer countEquipmentEntityByCreatedTime_Date(Date fromDate, Date toDate);

//    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
//            "count(e.id)) " +
//            "from EquipmentEntity e " +
//            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
//            "GROUP BY FUNCTION('year',(e.createdTime))" +
//            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
//    List<LineChartStatisticDTO> countEquipmentByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
//
//    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
//            "count(e.id)) " +
//            "from EquipmentEntity e " +
//            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
//            "GROUP BY FUNCTION('month',(e.createdTime))" +
//            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
//    List<LineChartStatisticDTO> countEquipmentByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
//
//    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
//            "count(e.id)) " +
//            "from EquipmentEntity e " +
//            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
//            "GROUP BY FUNCTION('week',(e.createdTime))" +
//            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
//    List<LineChartStatisticDTO> countEquipmentByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
//
//    @Query("select new com.ccp.webadmin.dtos.PieChartStatisticDTO(e.equipmentTypeEntity.name, " +
//            "count(e.id)) " +
//            "from EquipmentEntity e " +
//            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
//            "GROUP BY e.equipmentTypeEntity")
//    List<PieChartStatisticDTO> countEquipmentByEquipmentType(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
