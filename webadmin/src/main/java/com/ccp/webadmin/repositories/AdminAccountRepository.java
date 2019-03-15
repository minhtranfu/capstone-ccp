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

//    @Query("SELECT SUM (p.amount) FROM Product p WHERE p.category = :category")
//    Integer sumAmountByCategory(@Param("category") Category category);
//
//    @Query("select ")
    AdminAccountEntity findByAdminUserEntity_Email(String email);
}
