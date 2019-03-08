package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "feedback")
public class FeedbackEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Content is required not empty")
    @Size(max = 100, message = "Content is required less than 100 word")
    @Column(name = "content")
    private String content;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private Timestamp createdTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @ManyToOne()
    @JoinColumn(name = "to_contractor_id")
    private ContractorEntity contractorIsFeedbacked;

    @ManyToOne()
    @JoinColumn(name = "from_contractor_id")
    private ContractorEntity contractorFeedback;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "feedback_type_id")
    private FeedbackTypeEntity feedbackTypeEntity;

    public FeedbackEntity() {
    }



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Timestamp getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Timestamp createdTime) {
        this.createdTime = createdTime;
    }

    public ContractorEntity getContractorIsFeedbacked() {
        return contractorIsFeedbacked;
    }

    public void setContractorIsFeedbacked(ContractorEntity contractorIsFeedbacked) {
        this.contractorIsFeedbacked = contractorIsFeedbacked;
    }

    public ContractorEntity getContractorFeedback() {
        return contractorFeedback;
    }

    public void setContractorFeedback(ContractorEntity contractorFeedback) {
        this.contractorFeedback = contractorFeedback;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public FeedbackTypeEntity getFeedbackTypeEntity() {
        return feedbackTypeEntity;
    }

    public void setFeedbackTypeEntity(FeedbackTypeEntity feedbackTypeEntity) {
        this.feedbackTypeEntity = feedbackTypeEntity;
    }
    public enum Status {
        PENDING("Pending"),
        VERIFIED("Verified"),
        NOT_VERIFIED("Not Verified");

        private String value;

        Status(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }

    @Override
    public String toString() {
        return "FeedbackEntity{" +
                "id=" + id +
                ", content='" + content + '\'' +
                ", createdTime=" + createdTime +
                ", status=" + status +
                ", contractorIsFeedbacked=" + contractorIsFeedbacked +
                ", contractorFeedback=" + contractorFeedback +
                ", feedbackTypeEntity=" + feedbackTypeEntity +
                '}';
    }
}
