package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.entities.AdminUserEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.repositories.AdminUserRepository;
import com.ccp.webadmin.services.AdminAccountService;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminAccountServiceImpl implements AdminAccountService {

    private final AdminAccountRepository adminAccountRepository;

    private final AdminUserRepository adminUserRepository;

    @Autowired
    public AdminAccountServiceImpl(AdminAccountRepository adminAccountRepository, AdminUserRepository adminUserRepository) {
        this.adminAccountRepository = adminAccountRepository;
        this.adminUserRepository = adminUserRepository;
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
//        if (findById(adminAccountEntity.getId()) != null) {
//            System.out.println("aaaaaaaa" + adminAccountEntity);
//            adminAccountEntity.getAccount().setAdminAccountEntity(findById(adminAccountEntity.getId()));
//            System.out.println("bbbbbb" + adminAccountEntity);
         adminAccountRepository.save(adminAccountEntity);

    }

    @Override
    public void deleteById(Integer id) {

    }

    @Override
    public boolean existsAdminAccountEntity(AdminAccountEntity adminAccountEntity) {
        return adminAccountRepository.existsById(adminAccountEntity.getId());
    }
//
//    @Override
//    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
//        return adminAccountRepository.findByUsername(username).orElseThrow(
//                () -> new RuntimeException("Username not found!")
//        );
//    }
}
