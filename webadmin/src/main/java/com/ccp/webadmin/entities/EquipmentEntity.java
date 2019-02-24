package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Objects;

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

    @Column(name = "delivery_price")
    private Double deliveryPrice;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private String status;

    @Column(name = "thumbnail_image")
    private String thumbnailImage;

    @Column(name = "is_deleted")
    private Boolean isDeleted;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @Column(name = "address")
    private String address;

    @Column(name = "long")
    private Double longitude;

    @Column(name = "lat")
    private Double lat;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipment_type_id")
    private EquipmentTypeEntity equipmentTypeEntity;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;

//    @Basic
//    @Column(name = "construction_id")
//    public Integer getConstructionId() {
//        return constructionId;
//    }


//    @Basic
//    @Column(name = "description_image_id")
//    public Integer getDescriptionImageId() {
//        return descriptionImageId;
//    }
//
//    public void setDescriptionImageId(Integer descriptionImageId) {
//        this.descriptionImageId = descriptionImageId;
//    }


    public EquipmentEntity() {
    }

    public EquipmentEntity(@NotNull(message = "Name is required not empty") @Size(min = 3, message = "Equipment's name required more than 3 letters") String name, Double dailyPrice, Double deliveryPrice, String description, String status, String thumbnailImage, Boolean isDeleted, LocalDateTime createdTime, LocalDateTime updatedTime, String address, Double longitude, Double lat, EquipmentTypeEntity equipmentTypeEntity, ContractorEntity contractorEntity) {
        this.name = name;
        this.dailyPrice = dailyPrice;
        this.deliveryPrice = deliveryPrice;
        this.description = description;
        this.status = status;
        this.thumbnailImage = thumbnailImage;
        this.isDeleted = isDeleted;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.address = address;
        this.longitude = longitude;
        this.lat = lat;
        this.equipmentTypeEntity = equipmentTypeEntity;
        this.contractorEntity = contractorEntity;
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

    public Double getDeliveryPrice() {
        return deliveryPrice;
    }

    public void setDeliveryPrice(Double deliveryPrice) {
        this.deliveryPrice = deliveryPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
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
}
