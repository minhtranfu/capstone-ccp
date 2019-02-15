package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.ContractorEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContractorRepository extends JpaRepository<ContractorEntity, Integer>
{

}
