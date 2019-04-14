package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.MaterialTransactionDetailEntity;
import com.ccp.webadmin.entities.MaterialTransactionEntity;
import com.ccp.webadmin.repositories.MaterialTransactionDetailRepository;
import com.ccp.webadmin.repositories.MaterialTransactionRepository;
import com.ccp.webadmin.services.MaterialTransactionDetailService;
import com.ccp.webadmin.services.MaterialTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialTransactionDetailServiceImpl implements MaterialTransactionDetailService {

    private final MaterialTransactionDetailRepository materialTransactionDetailRepository;

    @Autowired
    public MaterialTransactionDetailServiceImpl(MaterialTransactionDetailRepository materialTransactionDetailRepository) {
        this.materialTransactionDetailRepository = materialTransactionDetailRepository;
    }

    @Override
    public List<MaterialTransactionDetailEntity> findAll() {
        return materialTransactionDetailRepository.findAll();
    }

    @Override
    public List<MaterialTransactionDetailEntity> findAllByMaterialTransactionEntity(MaterialTransactionEntity materialTransactionEntity) {
        return materialTransactionDetailRepository.findAllByMaterialTransactionEntity(materialTransactionEntity);
    }

    @Override
    public MaterialTransactionDetailEntity findById(Integer id) {
        return materialTransactionDetailRepository.findById(id).get();
    }

    @Override
    public void save(MaterialTransactionDetailEntity materialTransactionDetailEntity) {
        materialTransactionDetailRepository.save(materialTransactionDetailEntity);
    }

    @Override
    public void deleteById(Integer id) {
        materialTransactionDetailRepository.deleteById(id);
    }
}
