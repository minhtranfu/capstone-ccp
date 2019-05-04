package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.ReportTypeEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ReportTypeService {
    List<ReportTypeEntity> findAll();

    ReportTypeEntity findById(Integer id);

    void save(ReportTypeEntity reportTypeEntity);

    boolean existsByName(String name);

    void deleteById(Integer id);
}
