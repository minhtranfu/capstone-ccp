package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminAccountRepository extends JpaRepository<AdminAccountEntity, Integer>
{
    Optional<AdminAccountEntity> findByUsername(String username);

    boolean existsByUsername(String username);
}
