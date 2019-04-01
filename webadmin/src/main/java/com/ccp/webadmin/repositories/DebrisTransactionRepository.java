package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.DebrisTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DebrisTransactionRepository extends JpaRepository<DebrisTransactionEntity, Integer> {

//    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('year',(transaction.updatedTime))," +
//            "COUNT(transaction.id) ," +
//            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
//            "FROM DebrisTransactionEntity transaction " +
//            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
//            "GROUP BY FUNCTION('year',(transaction.updatedTime))" +
//            "ORDER BY FUNCTION('year',(transaction.updatedTime)) asc")
//    List<StatisticHiringTransactionDTO> countStatisticByYear(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
//
//    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('month',(transaction.updatedTime))," +
//            "COUNT(transaction.id) ," +
//            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
//            "FROM DebrisTransactionEntity transaction " +
//            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
//            "GROUP BY FUNCTION('month',(transaction.updatedTime))" +
//            "ORDER BY FUNCTION('month',(transaction.updatedTime)) asc")
//    List<StatisticHiringTransactionDTO> countStatisticByMonth(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);
//
//    @Query("SELECT new com.ccp.webadmin.dtos.StatisticHiringTransactionDTO(FUNCTION('week',(transaction.updatedTime))," +
//            "COUNT(transaction.id) ," +
//            "SUM(CASE WHEN status = 'FINISHED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'PENDING' or status = 'ACCEPTED' THEN 1 ELSE 0 END) ," +
//            "SUM(CASE WHEN status = 'CANCELED' or status = 'DENIED' THEN 1 ELSE 0 END) ) " +
//            "FROM DebrisTransactionEntity   transaction " +
//            "where transaction.updatedTime >= :beginDate and transaction.updatedTime <= :endDate " +
//            "GROUP BY FUNCTION('week',(transaction.updatedTime))" +
//            "ORDER BY FUNCTION('week',(transaction.updatedTime)) asc")
//    List<StatisticHiringTransactionDTO> countStatisticByWeek(@Param("beginDate") LocalDateTime beginDate, @Param("endDate") LocalDateTime endDate);

}
