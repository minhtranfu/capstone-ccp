package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "contractor_verifying_image")
//@Where(clause = "is_deleted='false'")
public class ContractorVerifyingImageEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "url")
    private String name;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;


    public ContractorVerifyingImageEntity() {
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


    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }
}
