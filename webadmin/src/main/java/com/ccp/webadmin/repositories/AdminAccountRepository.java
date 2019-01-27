package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminAccountRepository extends JpaRepository<AdminAccountEntity, Integer>
{
}
