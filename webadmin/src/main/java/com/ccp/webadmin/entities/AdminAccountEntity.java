package com.ccp.webadmin.entities;
import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import javax.validation.Valid;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "admin_account")
@Where(clause = "is_deleted = 0")
public class AdminAccountEntity implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(min = 3, message = "Username required more than 3 letters")
    @Column(name = "username")
    private String username;

    @Size(min = 3, message = "Password required more than 3 letters")
    @Column(name = "password")
    private String password;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @OneToOne(cascade = CascadeType.ALL,
             optional = false)
    @JoinColumn(name = "admin_user_id")
    @Valid
    private AdminUserEntity adminUserEntity;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<GrantedAuthority> authorities = new ArrayList<>();
        GrantedAuthority authority = new SimpleGrantedAuthority(this.getAdminUserEntity().getRole().getRoleName().toString());
        authorities.add(authority);
        return authorities;
    }

    public AdminAccountEntity() {
    }

    public AdminAccountEntity(String username, String password, AdminUserEntity adminUserEntity) {
        this.username = username;
        this.password = password;
        this.adminUserEntity = adminUserEntity;
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

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public AdminUserEntity getAdminUserEntity() {
        return adminUserEntity;
    }

    public void setAdminUserEntity(AdminUserEntity adminUserEntity) {
        if (adminUserEntity == null) {
            if (this.adminUserEntity != null) {
                this.adminUserEntity.setAdminAccountEntity(null);
            }
        } else {
            adminUserEntity.setAdminAccountEntity(this);
        }
        this.adminUserEntity = adminUserEntity;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public LocalDateTime getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(LocalDateTime updatedTime) {
        this.updatedTime = updatedTime;
    }
}
