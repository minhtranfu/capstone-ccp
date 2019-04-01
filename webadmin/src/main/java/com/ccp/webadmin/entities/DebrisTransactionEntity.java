package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "debris_transaction")
public class DebrisTransactionEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "price")
    private Double price;

    @Column(name = "cancel_reason")
    private String cancelReason;

    @Column(name = "debris_post_id")
    private Integer debrisPostId;

    @ManyToOne
    @JoinColumn(name = "debris_bid_id")
    private DebrisBidEntity debrisBidEntity;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    public DebrisTransactionEntity() {
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCancelReason() {
        return cancelReason;
    }

    public void setCancelReason(String cancelReason) {
        this.cancelReason = cancelReason;
    }

    public Integer getDebrisPostId() {
        return debrisPostId;
    }

    public void setDebrisPostId(Integer debrisPostId) {
        this.debrisPostId = debrisPostId;
    }

    public DebrisBidEntity getDebrisBidEntity() {
        return debrisBidEntity;
    }

    public void setDebrisBidEntity(DebrisBidEntity debrisBidEntity) {
        this.debrisBidEntity = debrisBidEntity;
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

    public enum Status {
        ACCEPTED("Accepted"),
        DELIVERING("Delivering"),
        WORKING("Working"),
        FINISHED("Finished"),
        CANCELED("Canceled");

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
