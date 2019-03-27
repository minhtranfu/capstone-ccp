package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReportService {
//    boolean ex(ReportTypeEntity feedbackTypeEntity);

    List<ReportEntity> findAll();

    List<ReportEntity> findByFeedbackEntities(ReportTypeEntity reportTypeEntity);

    ReportEntity findById(Integer id);

    void save(ReportEntity reportEntity);

    void deleteById(Integer id);

    Integer countFeedbackByContractor(ContractorEntity contractor);

    Integer countNewReport();

}
