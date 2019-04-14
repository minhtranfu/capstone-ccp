package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "debris_bid")
public class DebrisBidEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "price")
    private Double price;

    @Column(name = "description", nullable = true, length = -1, columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private ContractorEntity supplier;

    @ManyToOne
    @JoinColumn(name = "debris_post_id")
    private DebrisPostEntity debrisPostEntity;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    public DebrisBidEntity() {
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContractorEntity getSupplier() {
        return supplier;
    }

    public void setSupplier(ContractorEntity supplier) {
        this.supplier = supplier;
    }

    public DebrisPostEntity getDebrisPostEntity() {
        return debrisPostEntity;
    }

    public void setDebrisPostEntity(DebrisPostEntity debrisPostEntity) {
        this.debrisPostEntity = debrisPostEntity;
    }

    public boolean isDeleted() {
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

    public enum Status {
        PENDING("Pending"),
        ACCEPTED("Accepted"),
        FINISHED("Finished");

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
