package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Table(name = "debris_post")
public class DebrisPostEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Column(name = "title")
    private String title;

    @Column(name = "address")
    private String address;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "latitude")
    private Double lat;

    @Column(name = "description", nullable = true, length = -1, columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    @JoinColumn(name = "requester_id")
    private ContractorEntity requester;

    @Column(name = "is_hidden")
    private boolean isHidden;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime updatedTime;

    @ManyToMany
    @JoinTable(name = "debris_service_type_debris_post",
            joinColumns = @JoinColumn(name = "debris_post_id"),
            inverseJoinColumns = @JoinColumn(name = "debris_service_type_id"))
    private Collection<DebrisServiceTypeEntity> debrisServiceTypes;

    public DebrisPostEntity() {
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ContractorEntity getRequester() {
        return requester;
    }

    public void setRequester(ContractorEntity requester) {
        this.requester = requester;
    }

    public boolean isHidden() {
        return isHidden;
    }

    public void setHidden(boolean hidden) {
        isHidden = hidden;
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

    public Collection<DebrisServiceTypeEntity> getDebrisServiceTypes() {
        return debrisServiceTypes;
    }

    public void setDebrisServiceTypes(Collection<DebrisServiceTypeEntity> debrisServiceTypes) {
        this.debrisServiceTypes = debrisServiceTypes;
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
