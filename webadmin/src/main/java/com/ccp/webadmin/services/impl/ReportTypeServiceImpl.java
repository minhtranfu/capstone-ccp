package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ReportTypeEntity;
import com.ccp.webadmin.repositories.ReportTypeRepository;
import com.ccp.webadmin.services.ReportTypeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportTypeServiceImpl implements ReportTypeService {

    private final ReportTypeRepository reportTypeRepository;

    @Autowired
    public ReportTypeServiceImpl(ReportTypeRepository reportTypeRepository) {
        this.reportTypeRepository = reportTypeRepository;
    }

    @Override
    public List<ReportTypeEntity> findAll() {
        return reportTypeRepository.findAllNotDeleted();
    }

    @Override
    public ReportTypeEntity findById(Integer id) {
        return reportTypeRepository.findById(id).get();
    }

    @Override
    public void save(ReportTypeEntity reportTypeEntity) {
        reportTypeRepository.save(reportTypeEntity);
    }

    @Override
    public void deleteById(Integer id) {
        reportTypeRepository.deleteById(id);
    }
}
