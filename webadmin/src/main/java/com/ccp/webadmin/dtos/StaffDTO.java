package com.ccp.webadmin.dtos;

import com.ccp.webadmin.entities.ContractorEntity;

import java.io.Serializable;

public class StaffDTO implements Serializable {


    private Integer id;

    private String password;

    private String newPassword;

    public StaffDTO() {
    }

    public StaffDTO(Integer id) {
        this.id = id;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
