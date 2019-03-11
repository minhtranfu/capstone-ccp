package com.ccp.webadmin.dtos;

import com.ccp.webadmin.entities.ContractorEntity;
import com.ccp.webadmin.entities.EquipmentTypeEntity;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.sql.Timestamp;

public class NotificationDTO implements Serializable {


    private String title;

    private String content;

    private ContractorEntity contractorEntity;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public NotificationDTO(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public NotificationDTO() {
    }
}
