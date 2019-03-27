package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "material")
public class MaterialEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required not empty")
    @Size(min = 3, message = "Material's name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @NotNull(message = "Manufacturer is required not empty")
    @Size(min = 3, message = "Material's manufacturer required more than 3 letters")
    @Column(name = "manufacturer")
    private String manufacturer;

    @Column(name = "description", nullable = true, length = -1, columnDefinition = "TEXT")
    private String description;

    @Column(name = "thumbnail_image_url")
    private String thumbnail;

    @Column(name = "is_hidden")
    private Boolean isHidden;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @ManyToOne
    @JoinColumn(name = "material_type_id")
    private MaterialTypeEntity materialTypeEntity;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;

    public MaterialEntity() {
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
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

    public MaterialTypeEntity getMaterialTypeEntity() {
        return materialTypeEntity;
    }

    public void setMaterialTypeEntity(MaterialTypeEntity materialTypeEntity) {
        this.materialTypeEntity = materialTypeEntity;
    }

    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public Boolean getHidden() {
        return isHidden;
    }

    public void setHidden(Boolean hidden) {
        isHidden = hidden;
    }
}
