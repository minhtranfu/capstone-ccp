package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.repositories.AdminUserRepository;
import com.ccp.webadmin.services.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAccountImpl implements AdminAccountService {

    private final AdminAccountRepository adminAccountRepository;
    private final AdminUserRepository adminUserRepository;

    @Autowired
    public AdminAccountImpl(AdminAccountRepository adminAccountRepository, AdminUserRepository adminUserRepository) {
        this.adminAccountRepository = adminAccountRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public List<AdminUserEntity> findAll() {
        return adminUserRepository.findAll();
    }

    @Override
    public AdminUserEntity findStaffById(Integer id) {
        return adminUserRepository.findById(id).get();
    }

    @Override
    public void saveProduct(AdminAccountEntity adminAccountEntity) {

    }
}
