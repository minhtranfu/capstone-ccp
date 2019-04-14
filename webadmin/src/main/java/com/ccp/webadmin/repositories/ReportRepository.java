package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ReportEntity;
import com.ccp.webadmin.entities.ReportTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportRepository extends JpaRepository<ReportEntity, Integer> {
    List<ReportEntity> findAllByReportTypeEntity(ReportTypeEntity reportTypeEntity);

//    Integer countFeedbackEntityByContractorIsFeedbacked(ContractorEntity contractorEntity);

//    Integer countFeedbackEntityByStatus_VerifiedAndContractorIsFeedbacked(ContractorEntity contractorEntity);

    @Query("select count(f) from ReportEntity f where 1=2 and f.contractorIsReported = :contractorEntity")
    Integer countFeedbackEntity(ContractorEntity contractorEntity);

    @Query("select count(f) from ReportEntity f where f.status = 'PENDING'")
    Integer countNewFeedback();
}
