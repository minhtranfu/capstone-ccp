package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "hiring_transaction")
public class HiringTransactionEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Content is required not empty")
    @Size(max = 45, message = "status")
    @Column(name = "status")
    private String status;

    @NotNull(message = "Price is required not empty")
    @Column(name = "daily_price")
    private Double dailyPrice;

    @NotNull(message = "Price is required not empty")
    @Column(name = "delivery_price")
    private Double deliveryPrice;

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "updated_time")
    private LocalDateTime updatedTime;

    @Column(name = "begin_date")
    private LocalDate beginDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "equipment_address")
    private String equipmentAddress;

    @Column(name = "equipment_long")
    private Double equipmentLong;

    @Column(name = "equipment_lat")
    private Double equipmentLat;

    @Column(name = "requester_address")
    private String requesterAddress;

    @Column(name = "requester_long")
    private Double requesterLong;

    @Column(name = "requester_lat")
    private Double requesterLat;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "requester_id")
    private ContractorEntity requester;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "equipment_id")
    private EquipmentEntity equipment;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    public HiringTransactionEntity() {
    }

    public HiringTransactionEntity(@NotNull(message = "Content is required not empty") @Size(max = 45, message = "status") String status, @NotNull(message = "Price is required not empty") Double dailyPrice, @NotNull(message = "Price is required not empty") Double deliveryPrice, LocalDateTime createdTime, LocalDateTime updatedTime, LocalDate beginDate, LocalDate endDate, String equipmentAddress, Double equipmentLong, Double equipmentLat, String requesterAddress, Double requesterLong, Double requesterLat, ContractorEntity requester, EquipmentEntity equipment, boolean isDeleted) {
        this.status = status;
        this.dailyPrice = dailyPrice;
        this.deliveryPrice = deliveryPrice;
        this.createdTime = createdTime;
        this.updatedTime = updatedTime;
        this.beginDate = beginDate;
        this.endDate = endDate;
        this.equipmentAddress = equipmentAddress;
        this.equipmentLong = equipmentLong;
        this.equipmentLat = equipmentLat;
        this.requesterAddress = requesterAddress;
        this.requesterLong = requesterLong;
        this.requesterLat = requesterLat;
        this.requester = requester;
        this.equipment = equipment;
        this.isDeleted = isDeleted;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public LocalDate getBeginDate() {
        return beginDate;
    }

    public void setBeginDate(LocalDate beginDate) {
        this.beginDate = beginDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getEquipmentAddress() {
        return equipmentAddress;
    }

    public void setEquipmentAddress(String equipmentAddress) {
        this.equipmentAddress = equipmentAddress;
    }

    public Double getEquipmentLong() {
        return equipmentLong;
    }

    public void setEquipmentLong(Double equipmentLong) {
        this.equipmentLong = equipmentLong;
    }

    public Double getEquipmentLat() {
        return equipmentLat;
    }

    public void setEquipmentLat(Double equipmentLat) {
        this.equipmentLat = equipmentLat;
    }

    public String getRequesterAddress() {
        return requesterAddress;
    }

    public void setRequesterAddress(String requesterAddress) {
        this.requesterAddress = requesterAddress;
    }

    public Double getRequesterLong() {
        return requesterLong;
    }

    public void setRequesterLong(Double requesterLong) {
        this.requesterLong = requesterLong;
    }

    public Double getRequesterLat() {
        return requesterLat;
    }

    public void setRequesterLat(Double requesterLat) {
        this.requesterLat = requesterLat;
    }

    public ContractorEntity getRequester() {
        return requester;
    }

    public void setRequester(ContractorEntity requester) {
        this.requester = requester;
    }

    public EquipmentEntity getEquipment() {
        return equipment;
    }

    public void setEquipment(EquipmentEntity equipment) {
        this.equipment = equipment;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
