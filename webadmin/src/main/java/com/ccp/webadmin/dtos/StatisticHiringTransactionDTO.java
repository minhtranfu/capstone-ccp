package com.ccp.webadmin.dtos;

import org.codehaus.jackson.annotate.JsonCreator;
import org.codehaus.jackson.annotate.JsonProperty;

import java.io.Serializable;

public class StatisticHiringTransactionDTO implements Serializable {


    private Integer timeUnit;
    private Long totalCount;
    private Long totalFinished;
    private Long totalProcessing;
    private Long totalCanceled;

    public StatisticHiringTransactionDTO() {
    }

    public StatisticHiringTransactionDTO(Integer timeUnit, Long totalCount, Long totalFinished, Long totalProcessing, Long totalCanceled) {
        this.timeUnit = timeUnit;
        this.totalCount = totalCount;
        this.totalFinished = totalFinished;
        this.totalProcessing = totalProcessing;
        this.totalCanceled = totalCanceled;
    }

    public Integer getTimeUnit() {
        return timeUnit;
    }

    public void setTimeUnit(Integer timeUnit) {
        this.timeUnit = timeUnit;
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }

    public Long getTotalFinished() {
        return totalFinished;
    }

    public void setTotalFinished(Long totalFinished) {
        this.totalFinished = totalFinished;
    }

    public Long getTotalProcessing() {
        return totalProcessing;
    }

    public void setTotalProcessing(Long totalProcessing) {
        this.totalProcessing = totalProcessing;
    }

    public Long getTotalCanceled() {
        return totalCanceled;
    }

    public void setTotalCanceled(Long totalCanceled) {
        this.totalCanceled = totalCanceled;
    }
}
