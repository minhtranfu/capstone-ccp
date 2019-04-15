package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import com.ccp.webadmin.entities.HiringTransactionEntity;
import com.ccp.webadmin.repositories.ContractorVerifyingImageRepository;
import com.ccp.webadmin.repositories.HiringTransactionRepository;
import com.ccp.webadmin.services.ContractorVerifyingImageService;
import com.ccp.webadmin.services.HiringTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractorVerifyingImageServiceImpl implements ContractorVerifyingImageService {

    private final ContractorVerifyingImageRepository contractorVerifyingImageRepository;

    @Autowired
    public ContractorVerifyingImageServiceImpl(ContractorVerifyingImageRepository contractorVerifyingImageRepository) {
        this.contractorVerifyingImageRepository = contractorVerifyingImageRepository;
    }

    @Override
    public List<ContractorVerifyingImageEntity> findAll() {
        return contractorVerifyingImageRepository.findAll();
    }

    @Override
    public ContractorVerifyingImageEntity findById(Integer id) {
        return contractorVerifyingImageRepository.findById(id).get();
    }

    @Override
    public List<ContractorVerifyingImageEntity> findByContractor(ContractorEntity contractorEntity) {
        return contractorVerifyingImageRepository.findAllByContractorEntity(contractorEntity);
    }

    @Override
    public void save(ContractorVerifyingImageEntity contractorVerifyingImageEntity) {
        contractorVerifyingImageRepository.save(contractorVerifyingImageEntity);
    }
}
