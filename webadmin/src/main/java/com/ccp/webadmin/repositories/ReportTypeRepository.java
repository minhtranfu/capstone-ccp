package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ReportTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReportTypeRepository extends JpaRepository<ReportTypeEntity, Integer> {
    @Query("Select e from ReportTypeEntity e where e.isDeleted = false")
    List<ReportTypeEntity> findAllNotDeleted();

    boolean existsByName(String name);
}
