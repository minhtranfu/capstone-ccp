package com.ccp.webadmin.entities;

import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
public class EquipmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required not empty")
    @Size(min = 3, message = "Equipment's name required more than 3 letters")
    @Column(name = "name")
    private String name;


    @Column(name = "daily_price")
    private Double dailyPrice;

    @Column(name = "description", nullable = true, length = -1, columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @ManyToOne
    @JoinColumn(name = "equipment_type_id")
    private EquipmentTypeEntity equipmentTypeEntity;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;

    @ManyToOne
    @JoinColumn(name = "construction_id")
    private ConstructionEntity constructionEntity;


    public EquipmentEntity() {
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

    public Double getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Double dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public boolean getDeleted() {
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

    public EquipmentTypeEntity getEquipmentTypeEntity() {
        return equipmentTypeEntity;
    }

    public void setEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity) {
        this.equipmentTypeEntity = equipmentTypeEntity;
    }

    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public ConstructionEntity getConstructionEntity() {
        return constructionEntity;
    }

    public void setConstructionEntity(ConstructionEntity constructionEntity) {
        this.constructionEntity = constructionEntity;
    }

    public enum Status {
        AVAILABLE("Available"),
        DELIVERING("Delivering"),
        RENTING("Renting"),
        WAITING_FOR_RETURNING("Waiting for returning"),
        ;

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
