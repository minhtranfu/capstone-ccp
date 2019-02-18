package com.ccp.webadmin.entities;

//import org.springframework.security.core.GrantedAuthority;
//import org.springframework.security.core.authority.SimpleGrantedAuthority;
//import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "admin_account")
public class AdminAccountEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull
    @Column(name = "username")
    private String username;

    @NotNull
    @Column(name = "password")
    private String password;

    @OneToOne(mappedBy = "adminAccountEntity", cascade = CascadeType.ALL,
            fetch = FetchType.LAZY, optional = false)
    private AdminUserEntity account;

//    @Override
//    public Collection<? extends GrantedAuthority> getAuthorities() {
//        List<GrantedAuthority> authorities = new ArrayList<>();
//        GrantedAuthority authority = new SimpleGrantedAuthority(this.getAccount().getRoleId().toString());
//        authorities.add(authority);
//        return authorities;
//    }

    public AdminAccountEntity() {
    }

    public AdminAccountEntity(String username, String password, AdminUserEntity account) {
        this.username = username;
        this.password = password;
        this.account = account;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

//    @Override
//    public boolean isAccountNonExpired() {
//        return false;
//    }
//
//    @Override
//    public boolean isAccountNonLocked() {
//        return false;
//    }
//
//    @Override
//    public boolean isCredentialsNonExpired() {
//        return false;
//    }
//
//    @Override
//    public boolean isEnabled() {
//        return false;
//    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AdminUserEntity getAccount() {
        return account;
    }

    public void setAccount(AdminUserEntity account) {
        if (account == null) {
            if (this.account != null) {
                this.account.setAdminAccountEntity(null);
            }
        }
        else {
            account.setRoleId(2);
            account.setAdminAccountEntity(this);
        }
        this.account = account;
    }


}
