package com.ccp.webadmin.entities;

import lombok.Builder;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "contractor")
public class ContractorEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

//    @Size(min = 3, message = "Name required more than 3 letters")
    @Column(name = "name")
    private String name;

//    @Email(message = "Email required")
    @Column(name = "email")
    private String email;

//    @NotNull
    @Column(name = "phone_number")
    private String phone;

    @Column(name = "thumbnail_image")
    private String thumbnail;

    @Column(name = "status")
    private Integer status;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    public ContractorEntity() {
    }

    public ContractorEntity(String name, String email, String phone, String thumbnail, Integer status, LocalDateTime createdTime, LocalDateTime updatedTime) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.thumbnail = thumbnail;
        this.status = status;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
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
