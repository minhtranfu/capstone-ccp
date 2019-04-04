package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.DebrisTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface DebrisTransactionRepository extends JpaRepository<DebrisTransactionEntity, Integer> {

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('year',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'ACCEPTED' or status = 'DELIVERING' or status = 'WORKING' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) ) " +
            "FROM DebrisTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('year',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('year',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('month',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'ACCEPTED' or status = 'DELIVERING' or status = 'WORKING' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) ) " +
            "FROM DebrisTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('month',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('month',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('week',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'ACCEPTED' or status = 'DELIVERING' or status = 'WORKING' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' THEN 1 ELSE 0 END) ) " +
            "FROM DebrisTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('week',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('week',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
            "count(e.id)) " +
            "from DebrisTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.createdTime))" +
            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
            "count(e.id)) " +
            "from DebrisTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.createdTime))" +
            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
            "count(e.id)) " +
            "from DebrisTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.createdTime))" +
            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

}
