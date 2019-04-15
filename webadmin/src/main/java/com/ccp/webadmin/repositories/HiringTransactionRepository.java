package com.ccp.webadmin.repositories;

import com.ccp.webadmin.dtos.LineChartStatisticDTO;
import com.ccp.webadmin.dtos.StatisticHiringTransactionDTO;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.persistence.ColumnResult;
import javax.persistence.ConstructorResult;
import javax.persistence.SqlResultSetMapping;
import java.time.LocalDateTime;
import java.util.List;

public interface HiringTransactionRepository extends JpaRepository<HiringTransactionEntity, Integer> {
    //    @Query("select month(h.updated_time) as TimeUnit " +
//            "from HiringTransactionEntity h " +
//            "where h.updatedTime between :beginDate and :endDate")
    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('year',(hiring_transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM HiringTransactionEntity hiring_transaction " +
            "where hiring_transaction.updatedTime >= :beginDate and hiring_transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('year',(hiring_transaction.updatedTime))" +
            "ORDER BY FUNCTION('year',(hiring_transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('month',(hiring_transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM HiringTransactionEntity hiring_transaction " +
            "where hiring_transaction.updatedTime >= :beginDate and hiring_transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('month',(hiring_transaction.updatedTime))" +
            "ORDER BY FUNCTION('month',(hiring_transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('week',(hiring_transaction.updatedTime))," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM HiringTransactionEntity   hiring_transaction " +
            "where hiring_transaction.updatedTime >= :beginDate and hiring_transaction.updatedTime <= :endDate " +
            "GROUP BY FUNCTION('week',(hiring_transaction.updatedTime))" +
            "ORDER BY FUNCTION('week',(hiring_transaction.updatedTime)) asc")
    List<StatisticHiringTransactionDTO> countStatisticByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);


    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.createdTime))," +
            "count(e.id)) " +
            "from HiringTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('year',(e.createdTime))" +
            "ORDER BY FUNCTION('year',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalHiringTransactionByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.createdTime))," +
            "count(e.id)) " +
            "from HiringTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('month',(e.createdTime))" +
            "ORDER BY FUNCTION('month',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalHiringTransactionByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.createdTime))," +
            "count(e.id)) " +
            "from HiringTransactionEntity e " +
            "where e.createdTime >= :beginDate and e.createdTime <= :endDate " +
            "GROUP BY FUNCTION('week',(e.createdTime))" +
            "ORDER BY FUNCTION('week',(e.createdTime)) asc")
    List<LineChartStatisticDTO> countTotalHiringTransactionByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('year',(e.updatedTime))," +
            "sum (e.dailyPrice * abs(FUNCTION('datediff', e.beginDate, e.endDate)) + 1)) " +
            "from HiringTransactionEntity e " +
            "where e.updatedTime >= :beginDate and e.updatedTime <= :endDate " +
            "and e.status = 'FINISHED' " +
            "GROUP BY FUNCTION('year',(e.updatedTime))" +
            "ORDER BY FUNCTION('year',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceHiringTransactionByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('month',(e.updatedTime))," +
            "sum (e.dailyPrice * abs(FUNCTION('datediff', e.beginDate, e.endDate)) + 1)) " +
            "from HiringTransactionEntity e " +
            "where e.updatedTime >= :beginDate and e.updatedTime <= :endDate " +
            "and e.status = 'FINISHED' " +
            "GROUP BY FUNCTION('month',(e.updatedTime))" +
            "ORDER BY FUNCTION('month',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceHiringTransactionByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select new com.ccp.webadmin.dtos.LineChartStatisticDTO(FUNCTION('week',(e.updatedTime))," +
            "sum (e.dailyPrice * abs(FUNCTION('datediff', e.beginDate, e.endDate)) + 1)) " +
            "from HiringTransactionEntity e " +
            "where e.updatedTime >= :beginDate and e.updatedTime <= :endDate " +
            "and e.status = 'FINISHED' " +
            "GROUP BY FUNCTION('week',(e.updatedTime))" +
            "ORDER BY FUNCTION('week',(e.updatedTime)) asc")
    List<LineChartStatisticDTO> countTotalPriceHiringTransactionByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("select sum(e.dailyPrice * abs(FUNCTION('datediff', e.beginDate, e.endDate)) + 1) " +
            "from HiringTransactionEntity e " +
            "where function('month',(e.updatedTime))  = function('month',CURRENT_DATE) " +
            "and e.status = 'FINISHED' " +
            "GROUP BY FUNCTION('month',(e.updatedTime))")
    Integer countHiringTransactionIncome();
}
