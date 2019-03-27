package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.MaterialTransactionDetailEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MaterialTransactionDetailService {

    List<MaterialTransactionDetailEntity> findAll();

    List<MaterialTransactionDetailEntity> findAllByMaterialTransactionEntity(MaterialTransactionEntity materialTransactionEntity);

    MaterialTransactionDetailEntity findById(Integer id);

    void save(MaterialTransactionDetailEntity materialTransactionEntity);

    void deleteById(Integer id);



}
