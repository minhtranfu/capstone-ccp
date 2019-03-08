package com.ccp.webadmin.services;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface AdminAccountService  extends UserDetailsService {
    List<AdminAccountEntity> findAll();

    AdminAccountEntity findById(Integer id);

    void save(AdminAccountEntity adminAccountEntity);

    void deleteById(Integer id);

    boolean existsAdminAccountEntity(AdminAccountEntity adminAccountEntity);

}
