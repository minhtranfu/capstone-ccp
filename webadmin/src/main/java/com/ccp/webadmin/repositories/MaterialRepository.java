package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MaterialRepository extends JpaRepository<MaterialEntity, Integer> {

    List<MaterialEntity> findByMaterialTypeEntity(MaterialTypeEntity materialTypeEntity);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.createdTime))" +
            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countMaterialByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.createdTime))" +
            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countMaterialByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.createdTime))" +
            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countMaterialByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.PieChartStatisticDTO(e.materialTypeEntity.name, " +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY e.materialTypeEntity")
    List<PieChartStatisticDTO> countMaterialByMaterialType(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
