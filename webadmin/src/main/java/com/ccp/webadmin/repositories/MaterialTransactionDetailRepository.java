package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.MaterialTransactionDetailEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MaterialTransactionDetailRepository extends JpaRepository<MaterialTransactionDetailEntity, Integer> {
    List<MaterialTransactionDetailEntity> findAllByMaterialTransactionEntity(MaterialTransactionEntity materialTransactionEntity);
}
