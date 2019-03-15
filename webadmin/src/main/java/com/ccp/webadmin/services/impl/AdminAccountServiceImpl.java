package com.ccp.webadmin.services.impl;

import com.ccp.webadmin.entities.AdminAccountEntity;
import com.ccp.webadmin.repositories.AdminAccountRepository;
import com.ccp.webadmin.repositories.AdminUserRepository;
import com.ccp.webadmin.services.AdminAccountService;
import com.ccp.webadmin.utils.PasswordAutoGenerator;
import com.ccp.webadmin.utils.SendEmailService;
import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import java.io.IOException;
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
        adminAccountRepository.save(adminAccountEntity);
    }

    @Override
    public void deleteById(Integer id) {

    }

    @Override
    public boolean existsByUsername(String username) {
        return adminAccountRepository.existsByUsername(username);
    }

    @Override
    public boolean existsByEmail(String email) {
        return adminAccountRepository.existsByAdminUserEntity_Email(email);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminAccountRepository.findByUsername(username).orElseThrow(
                () -> new RuntimeException("Username not found!")
        );
    }

    @Override
    public AdminAccountEntity findByEmail(String email) {
        return adminAccountRepository.findByAdminUserEntity_Email(email);
    }
}
