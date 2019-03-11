package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.ContractorVerifyingImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractorVerifyingImageRepository extends JpaRepository<ContractorVerifyingImageEntity, Integer>
{
    List<ContractorVerifyingImageEntity> findAllByContractorEntity(ContractorEntity contractorEntity);
}
