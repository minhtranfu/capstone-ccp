package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "admin_user")
public class AdminUserEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

//    @Size(min = 3, message = "Name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @Column(name = "is_male")
    private boolean isMale;

//    @Pattern(regexp = "\\d{10}", message = "Invalid Phone Number")
    @Column(name = "phone", length = 10)
    private String phone;

//    @Email(message = "Email required")
    @Column(name = "email")
    private String email;


    @Column(name = "role_id")
    private Integer roleId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private AdminAccountEntity adminAccountEntity;

    public AdminUserEntity() {
    }

    public AdminUserEntity(String name, boolean isMale, String phone, String email, Integer roleId, AdminAccountEntity adminAccountEntity) {
        this.name = name;
        this.isMale = isMale;
        this.phone = phone;
        this.email = email;
        this.roleId = roleId;
        this.adminAccountEntity = adminAccountEntity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isMale() {
        return isMale;
    }

    public void setMale(boolean male) {
        isMale = male;
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

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public AdminAccountEntity getAdminAccountEntity() {
        return adminAccountEntity;
    }

    public void setAdminAccountEntity(AdminAccountEntity adminAccountEntity) {
        this.adminAccountEntity = adminAccountEntity;
    }

    @Override
    public String toString() {
        return "AdminUserEntity{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", isMale=" + isMale +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", roleId=" + roleId +
                ", adminAccountEntity=" + adminAccountEntity +
                '}';
    }
}
