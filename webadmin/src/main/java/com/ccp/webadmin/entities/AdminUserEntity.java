package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
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

    @Size(min = 3, message = "Name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @Column(name = "is_male")
    private boolean isMale;

    @Pattern(regexp = "^0(\\d{8,9})$", message = "Invalid Phone Number")
    @Column(name = "phone")
    private String phone;

    @NotNull(message = "Email required not null")
    @Email(message = "Email not correct")
    @Column(name = "email")
    private String email;

    @Size(min = 3, message = "Address required more than 3 letters")
    @Column(name = "address")
    private String address;

    @Column(name = "thumbnail_image")
    private String thumbnail;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private RoleEntity role;

    @OneToOne(mappedBy = "adminUserEntity")
    private AdminAccountEntity adminAccountEntity;

    public AdminUserEntity() {
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

    public RoleEntity getRole() {
        return role;
    }

    public void setRole(RoleEntity role) {
        this.role = role;
    }

    public AdminAccountEntity getAdminAccountEntity() {
        return adminAccountEntity;
    }

    public void setAdminAccountEntity(AdminAccountEntity adminAccountEntity) {
        this.adminAccountEntity = adminAccountEntity;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }
}
