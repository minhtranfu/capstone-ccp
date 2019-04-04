package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MaterialTransactionRepository extends JpaRepository<MaterialTransactionEntity, Integer> {

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('year',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM MaterialTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('year',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('year',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('month',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM MaterialTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('month',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('month',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('week',(transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM MaterialTransactionEntity transaction " +
            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('week',(transaction.updatedTime))" +
            "ORDER BY FUNCTION('week',(transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.createdTime))" +
            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.createdTime))" +
            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
            "count(e.id)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.createdTime))" +
            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalTransactionByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
            "sum (e.totalPrice)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.createdTime))" +
            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceTransactionByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
            "sum (e.totalPrice)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.createdTime))" +
            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceTransactionByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
            "sum (e.totalPrice)) " +
            "from MaterialTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.createdTime))" +
            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceTransactionByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
}
