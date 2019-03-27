package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminAccountEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface AdminAccountRepository extends JpaRepository<AdminAccountEntity, Integer>
{
    Optional<AdminAccountEntity> findByUsername(String username);

    boolean existsByUsername(String username);

    boolean existsByAdminUserEntity_Email(String email);

    AdminAccountEntity findByAdminUserEntity_Email(String email);

}
