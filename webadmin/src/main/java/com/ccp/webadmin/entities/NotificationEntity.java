package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification")
public class NotificationEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "title")
    private String title;

    @Column(name = "content")
    private String content;

    @Column(name = "click_action")
    private String clickAction;

    @Column(name = "is_read", insertable = false)
    private boolean isRead;

    @ManyToOne
    @JoinColumn(name = "contractor_id")
    private ContractorEntity contractorEntity;

    @Column(name = "created_time", updatable = false, insertable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private LocalDateTime createdTime;

    public NotificationEntity() {
    }

    public NotificationEntity(String title, String content, String clickAction, ContractorEntity contractorEntity) {
        this.title = title;
        this.content = content;
        this.clickAction = clickAction;
        this.contractorEntity = contractorEntity;
    }

    public NotificationEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getClickAction() {
        return clickAction;
    }

    public void setClickAction(String clickAction) {
        this.clickAction = clickAction;
    }

    public boolean getRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public ContractorEntity getContractorEntity() {
        return contractorEntity;
    }

    public void setContractorEntity(ContractorEntity contractorEntity) {
        this.contractorEntity = contractorEntity;
    }

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    @Override
    public String toString() {
        return "NotificationEntity{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", clickAction='" + clickAction + '\'' +
                ", isRead=" + isRead +
                ", contractorEntity=" + contractorEntity +
                ", createdTime=" + createdTime +
                '}';
    }
}
