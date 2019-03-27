package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ContractorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ContractorRepository extends JpaRepository<ContractorEntity, Integer>
{
    @Query("select count(c) from ContractorEntity c where c.status = 'NOT_VERIFIED'")
    Integer countNewContractor();
//    Integer countContractorEntityByStatus_NotVerifiedByStatus_NotVerified();
}
