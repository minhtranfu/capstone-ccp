package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.PieChartStatisticDTO;
import com.ccp.webadmin.entities.MaterialEntity;
import com.ccp.webadmin.entities.MaterialTypeEntity;
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

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.updatedTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.updatedTime))" +
            "ORDER BY FUNCTION('year',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countMaterialByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.updatedTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.updatedTime))" +
            "ORDER BY FUNCTION('month',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countMaterialByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.updatedTime))," +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.updatedTime))" +
            "ORDER BY FUNCTION('week',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countMaterialByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.PieChartStatisticDTO(e.materialTypeEntity.name, " +
            "count(e.id)) " +
            "from MaterialEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY e.materialTypeEntity")
    List<PieChartStatisticDTO> countMaterialByMaterialType(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
