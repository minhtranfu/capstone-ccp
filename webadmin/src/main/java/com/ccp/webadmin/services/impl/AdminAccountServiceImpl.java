package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.services.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AdminAccountRepository adminAccountRepository;

    @Autowired
    public AdminAccountServiceImpl(AdminAccountRepository adminAccountRepository) {
        this.adminAccountRepository = adminAccountRepository;
    }

    @Override
    public List<AdminAccountEntity> findAll() {
        return adminAccountRepository.findAll();
    }

    @Override
    public AdminAccountEntity findById(Integer id) {
        return adminAccountRepository.findById(id).get();
    }

    @Override
    public void save(AdminAccountEntity adminAccountEntity) {
//        AdminUserEntity adminUserEntity = new AdminUserEntity();
//
//        adminUserEntity.setName(adminAccountEntity.getAccount().getName());
//
//        adminUserEntity.setEmail(adminAccountEntity.getAccount().getEmail());
//
//        adminUserEntity.setPhone(adminAccountEntity.getAccount().getPhone());
//
//        adminUserEntity.setRoleId(2);
//
//        adminUserEntity.setMale(adminAccountEntity.getAccount().isMale());
//
//        adminAccountEntity.setAccount(adminUserEntity);
        adminAccountEntity.getAccount().setRoleId(2);
        System.out.println(adminAccountEntity);

        adminAccountRepository.save(adminAccountEntity);
        System.out.println(adminAccountEntity);
    }

    @Override
    public void deleteById(Integer id) {

    }
}
