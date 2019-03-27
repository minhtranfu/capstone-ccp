package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MaterialTransactionRepository extends JpaRepository<MaterialTransactionEntity, Integer> {
}
