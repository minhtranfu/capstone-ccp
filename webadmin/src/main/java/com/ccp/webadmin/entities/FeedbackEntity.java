package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDateTime;

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

    @Column(name = "created_time")
    private LocalDateTime createdTime;

    @Column(name = "is_read")
    private boolean isRead;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "to_contractor_id")
    private ContractorEntity contractorIsFeedbacked;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "from_contractor_id")
    private ContractorEntity contractorFeedback;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "feedback_type_id")
    private FeedbackTypeEntity feedbackTypeEntity;

    public FeedbackEntity() {
    }

    public FeedbackEntity(@NotNull(message = "Content is required not empty") @Size(max = 100, message = "Content is required less than 100 word") String content, LocalDateTime createdTime, boolean isRead, ContractorEntity contractorIsFeedbacked, ContractorEntity contractorFeedback, FeedbackTypeEntity feedbackTypeEntity) {
        this.content = content;
        this.createdTime = createdTime;
        this.isRead = isRead;
        this.contractorIsFeedbacked = contractorIsFeedbacked;
        this.contractorFeedback = contractorFeedback;
        this.feedbackTypeEntity = feedbackTypeEntity;
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

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
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

    public FeedbackTypeEntity getFeedbackTypeEntity() {
        return feedbackTypeEntity;
    }

    public void setFeedbackTypeEntity(FeedbackTypeEntity feedbackTypeEntity) {
        this.feedbackTypeEntity = feedbackTypeEntity;
    }
}
