package com.ccp.webadmin.entities;

import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "report")
public class ReportEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Content is required not empty")
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
    private ContractorEntity contractorIsReported;

    @ManyToOne()
    @JoinColumn(name = "from_contractor_id")
    private ContractorEntity contractorReport;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "report_type_id")
    private ReportTypeEntity reportTypeEntity;

    public ReportEntity() {
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

    public ContractorEntity getContractorIsReported() {
        return contractorIsReported;
    }

    public void setContractorIsReported(ContractorEntity contractorIsReported) {
        this.contractorIsReported = contractorIsReported;
    }

    public ContractorEntity getContractorReport() {
        return contractorReport;
    }

    public void setContractorReport(ContractorEntity contractorReport) {
        this.contractorReport = contractorReport;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public ReportTypeEntity getReportTypeEntity() {
        return reportTypeEntity;
    }

    public void setReportTypeEntity(ReportTypeEntity reportTypeEntity) {
        this.reportTypeEntity = reportTypeEntity;
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

}
