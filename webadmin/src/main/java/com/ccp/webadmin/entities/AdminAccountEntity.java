package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "admin_account")
public class AdminAccountEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "username")
    private String username;
    @Column(name = "password")
    private String password;

    @OneToOne( mappedBy = "adminAccountEntity", cascade = CascadeType.ALL)
    private AdminUserEntity account;

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
        this.account = account;
    }

    @Override
    public String toString() {
        return "AdminAccountEntity{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", account=" + account +
                '}';
    }
}
