package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_transaction_detail")
public class MaterialTransactionDetailEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "price")
    private Double price;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "unit")
    private String unit;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @Column(name = "material_address")
    private String materialAddress;

    @Column(name = "material_long")
    private Double materialLong;

    @Column(name = "material_lat")
    private Double materialLat;

    @ManyToOne
    @JoinColumn(name = "material_id")
    private MaterialEntity materialEntity;

    @ManyToOne
    @JoinColumn(name = "material_transaction_id")
    private MaterialTransactionEntity materialTransactionEntity;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    public MaterialTransactionDetailEntity() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
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

    public String getMaterialAddress() {
        return materialAddress;
    }

    public void setMaterialAddress(String materialAddress) {
        this.materialAddress = materialAddress;
    }

    public Double getMaterialLong() {
        return materialLong;
    }

    public void setMaterialLong(Double materialLong) {
        this.materialLong = materialLong;
    }

    public Double getMaterialLat() {
        return materialLat;
    }

    public void setMaterialLat(Double materialLat) {
        this.materialLat = materialLat;
    }

    public MaterialEntity getMaterialEntity() {
        return materialEntity;
    }

    public void setMaterialEntity(MaterialEntity materialEntity) {
        this.materialEntity = materialEntity;
    }

    public MaterialTransactionEntity getMaterialTransactionEntity() {
        return materialTransactionEntity;
    }

    public void setMaterialTransactionEntity(MaterialTransactionEntity materialTransactionEntity) {
        this.materialTransactionEntity = materialTransactionEntity;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
