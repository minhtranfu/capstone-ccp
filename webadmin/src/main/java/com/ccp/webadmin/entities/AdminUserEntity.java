package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "admin_user")
public class AdminUserEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;
    @Column(name = "is_male")
    private boolean is_male;
    @Column(name = "phone", length = 10)
    private String phone;
    @Column(name = "email")
    private String email;
    @Column(name = "role_id")
    private Integer role_id;

    public AdminUserEntity() {
    }

    public AdminUserEntity(String name, boolean is_male, String phone, String email, Integer role_id) {
        this.name = name;
        this.is_male = is_male;
        this.phone = phone;
        this.email = email;
        this.role_id = role_id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isIs_male() {
        return is_male;
    }

    public void setIs_male(boolean is_male) {
        this.is_male = is_male;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getRole_id() {
        return role_id;
    }

    public void setRole_id(Integer role_id) {
        this.role_id = role_id;
    }
}
