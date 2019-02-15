package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Objects;

@Entity
@Table(name = "equipment")
public class EquipmentEntity {
    private int id;
    private String name;
    private Integer dailyPrice;
    private Integer deliveryPrice;
    private String description;
    private String status;
    private String thumbnailImage;
    private Boolean isDeleted;
    private Timestamp createdTime;
    private Timestamp updatedTime;
    private Integer equipmentTypeId;
    private Integer contractorId;
    private Integer constructionId;
    private String address;
    private Double longitude;
    private Double lat;
    private Integer descriptionImageId;

    @Id
    @Column(name = "id")
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    @Basic
    @Column(name = "name")
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Basic
    @Column(name = "daily_price")
    public Integer getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Integer dailyPrice) {
        this.dailyPrice = dailyPrice;
    }

    @Basic
    @Column(name = "delivery_price")
    public Integer getDeliveryPrice() {
        return deliveryPrice;
    }

    public void setDeliveryPrice(Integer deliveryPrice) {
        this.deliveryPrice = deliveryPrice;
    }

    @Basic
    @Column(name = "description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Basic
    @Column(name = "status")
    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Basic
    @Column(name = "thumbnail_image")
    public String getThumbnailImage() {
        return thumbnailImage;
    }

    public void setThumbnailImage(String thumbnailImage) {
        this.thumbnailImage = thumbnailImage;
    }

    @Basic
    @Column(name = "is_deleted")
    public Boolean getDeleted() {
        return isDeleted;
    }

    public void setDeleted(Boolean deleted) {
        isDeleted = deleted;
    }

    @Basic
    @Column(name = "created_time")
    public Timestamp getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Timestamp createdTime) {
        this.createdTime = createdTime;
    }

    @Basic
    @Column(name = "updated_time")
    public Timestamp getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Timestamp updatedTime) {
        this.updatedTime = updatedTime;
    }

    @Basic
    @Column(name = "equipment_type_id")
    public Integer getEquipmentTypeId() {
        return equipmentTypeId;
    }

    public void setEquipmentTypeId(Integer equipmentTypeId) {
        this.equipmentTypeId = equipmentTypeId;
    }

    @Basic
    @Column(name = "contractor_id")
    public Integer getContractorId() {
        return contractorId;
    }

    public void setContractorId(Integer contractorId) {
        this.contractorId = contractorId;
    }

    @Basic
    @Column(name = "construction_id")
    public Integer getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Integer constructionId) {
        this.constructionId = constructionId;
    }

    @Basic
    @Column(name = "address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Basic
    @Column(name = "long")
    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    @Basic
    @Column(name = "lat")
    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    @Basic
    @Column(name = "description_image_id")
    public Integer getDescriptionImageId() {
        return descriptionImageId;
    }

    public void setDescriptionImageId(Integer descriptionImageId) {
        this.descriptionImageId = descriptionImageId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        EquipmentEntity that = (EquipmentEntity) o;
        return id == that.id &&
                Objects.equals(name, that.name) &&
                Objects.equals(dailyPrice, that.dailyPrice) &&
                Objects.equals(deliveryPrice, that.deliveryPrice) &&
                Objects.equals(description, that.description) &&
                Objects.equals(status, that.status) &&
                Objects.equals(thumbnailImage, that.thumbnailImage) &&
                Objects.equals(isDeleted, that.isDeleted) &&
                Objects.equals(createdTime, that.createdTime) &&
                Objects.equals(updatedTime, that.updatedTime) &&
                Objects.equals(equipmentTypeId, that.equipmentTypeId) &&
                Objects.equals(contractorId, that.contractorId) &&
                Objects.equals(constructionId, that.constructionId) &&
                Objects.equals(address, that.address) &&
                Objects.equals(longitude, that.longitude) &&
                Objects.equals(lat, that.lat) &&
                Objects.equals(descriptionImageId, that.descriptionImageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, dailyPrice, deliveryPrice, description, status, thumbnailImage, isDeleted, createdTime, updatedTime, equipmentTypeId, contractorId, constructionId, address, longitude, lat, descriptionImageId);
    }
}
