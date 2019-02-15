package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.ContractorEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ContractorService {

    List<ContractorEntity> findAll();

    ContractorEntity findById(Integer id);

    void save(ContractorEntity contractorEntity);

    void deleteById(Integer id);

}
