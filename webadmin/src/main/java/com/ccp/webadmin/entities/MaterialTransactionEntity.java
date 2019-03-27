package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "material_transaction")
public class MaterialTransactionEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

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
    @JoinColumn(name = "supplier_id")
    private ContractorEntity supplier;


    @Column(name = "is_deleted")
    private boolean isDeleted;

    public MaterialTransactionEntity() {
    }


    public enum Status {
        PENDING("Pending"),
        DELIVERVING("Delivering"),
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

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
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

    public ContractorEntity getSupplier() {
        return supplier;
    }

    public void setSupplier(ContractorEntity supplier) {
        this.supplier = supplier;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }
}
