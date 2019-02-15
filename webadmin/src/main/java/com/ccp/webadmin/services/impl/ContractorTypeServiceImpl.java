package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.repositories.ContractorRepository;
import com.ccp.webadmin.services.ContractorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ContractorTypeServiceImpl implements ContractorService {

    private final ContractorRepository contractorRepository;

    public ContractorTypeServiceImpl(ContractorRepository contractorRepository) {
        this.contractorRepository = contractorRepository;
    }

    @Override
    public List<ContractorEntity> findAll() {
        return contractorRepository.findAll();
    }

    @Override
    public ContractorEntity findById(Integer id) {
        return contractorRepository.findById(id).get();
    }

    @Override
    public void save(ContractorEntity contractorEntity) {
        contractorRepository.save(contractorEntity);
    }

    @Override
    public void deleteById(Integer id) {

    }
}
