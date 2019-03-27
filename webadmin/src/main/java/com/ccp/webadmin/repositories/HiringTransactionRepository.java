package com.ccp.webadmin.repositories;

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
                    "COUNT(hiring_transaction.id) ," +
                    "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
                    "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
                    "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
                    "FROM HiringTransactionEntity hiring_transaction " +
                    "WHERE  hiring_transaction.updatedTime between :beginDate AND :endDate " +
                    "GROUP BY FUNCTION('year',(hiring_transaction.updatedTime))" +
                    "ORDER BY FUNCTION('year',(hiring_transaction.updatedTime)) desc")
    List<StatisticHiringTransactionDTO> countStatisticByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('month',(hiring_transaction.updatedTime))," +
            "COUNT(hiring_transaction.id) ," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM HiringTransactionEntity hiring_transaction " +
            "WHERE  hiring_transaction.updatedTime between :beginDate AND :endDate " +
            "GROUP BY FUNCTION('month',(hiring_transaction.updatedTime))" +
            "ORDER BY FUNCTION('month',(hiring_transaction.updatedTime)) desc")
    List<StatisticHiringTransactionDTO> countStatisticByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('week',(hiring_transaction.updatedTime))," +
            "COUNT(hiring_transaction.id) ," +
            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
            "FROM HiringTransactionEntity hiring_transaction " +
            "WHERE  hiring_transaction.updatedTime between :beginDate AND :endDate " +
            "GROUP BY FUNCTION('week',(hiring_transaction.updatedTime))" +
            "ORDER BY FUNCTION('week',(hiring_transaction.updatedTime)) desc")
    List<StatisticHiringTransactionDTO> countStatisticByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

}
