package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;
import java.util.List;
import java.util.function.Predicate;

@Entity
@Table(name = "contractor")
public class ContractorEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(min = 3, message = "Name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @NotNull(message = "Email required not null")
    @Email(message = "Email required")
    @Column(name = "email")
    private String email;

    @Pattern(regexp = "^0(\\d{9})$", message = "Invalid Phone Number")
    @Column(name = "phone_number")
    private String phone;

    @Column(name = "thumbnail_image_url")
    private String thumbnail;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;


    @Column(name = "created_time", updatable = false, insertable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private Timestamp createdTime;

    @Column(name = "updated_time", updatable = false, insertable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private Timestamp updatedTime;


    @OneToMany(mappedBy = "contractorIsReported")
    private List<ReportEntity> receivedFeedbackEntities;

    public ContractorEntity() {
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }


    public List<ReportEntity> getReceivedFeedbackEntities() {
        return receivedFeedbackEntities;
    }

    public Integer countReceivedFeedbackEntity() {

        return (receivedFeedbackEntities != null) ? receivedFeedbackEntities.stream().filter(
                new Predicate<ReportEntity>() {
                    @Override
                    public boolean test(ReportEntity reportEntity) {
                        return reportEntity.getStatus() == ReportEntity.Status.VERIFIED;
                    }
                }
        ).toArray().length : 0;
    }

    public void setReceivedFeedbackEntities(List<ReportEntity> receivedFeedbackEntities) {
        this.receivedFeedbackEntities = receivedFeedbackEntities;
    }

    public Timestamp getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Timestamp createdTime) {
        this.createdTime = createdTime;
    }

    public Timestamp getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Timestamp updatedTime) {
        this.updatedTime = updatedTime;
    }

    public enum Status {
        NOT_VERIFIED("Not Verified"),
        ACTIVATED("Activated"),
        DEACTIVATED("Deactivated"),
        ;

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
