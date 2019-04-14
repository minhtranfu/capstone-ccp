package com.ccp.webadmin.repositories;

import com.ccp.webadmin.entities.AdminUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminUserRepository extends JpaRepository<AdminUserEntity, Integer>
{
}
