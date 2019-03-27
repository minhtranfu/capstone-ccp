package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.*;
import com.ccp.webadmin.repositories.ReportRepository;
import com.ccp.webadmin.services.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final ReportRepository reportRepository;

    @Autowired
    public ReportServiceImpl(ReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    @Override
    public List<ReportEntity> findAll() {
        return reportRepository.findAll();
    }

    @Override
    public List<ReportEntity> findByFeedbackEntities(ReportTypeEntity reportTypeEntity) {
        return reportRepository.findAllByReportTypeEntity(reportTypeEntity);
    }

    @Override
    public ReportEntity findById(Integer id) {
        return reportRepository.findById(id).get();
    }

    @Override
    public void save(ReportEntity reportEntity) {
        reportRepository.save(reportEntity);
    }


    @Override
    public void deleteById(Integer id) {
        reportRepository.deleteById(id);
    }

    @Override
    public Integer countFeedbackByContractor(ContractorEntity contractor) {
        return reportRepository.countFeedbackEntity(contractor);
    }

    @Override
    public Integer countNewReport() {
        return reportRepository.countNewFeedback();
    }


}
