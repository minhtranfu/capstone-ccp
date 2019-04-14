package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
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

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @NotNull(message = "Price is required not empty")
    @Column(name = "daily_price")
    private Double dailyPrice;

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

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private ContractorEntity requester;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private EquipmentEntity equipment;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    public HiringTransactionEntity() {
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Double getDailyPrice() {
        return dailyPrice;
    }

    public void setDailyPrice(Double dailyPrice) {
        this.dailyPrice = dailyPrice;
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

    public enum Status {
        PENDING("Pending"),
        PROCESSING("Processing"),
        ACCEPTED("Accepted"),
        FINISHED("Finished"),
        CANCELED("Canceled"),
        DENIED("Denied");

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
