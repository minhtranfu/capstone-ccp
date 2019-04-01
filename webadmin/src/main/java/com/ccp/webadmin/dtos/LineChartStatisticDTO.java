package com.ccp.webadmin.dtos;

import java.io.Serializable;

public class LineChartStatisticDTO implements Serializable {


    private Integer timeUnit;

    private Long quantity;

    private Double price;

    public LineChartStatisticDTO() {
    }

    public LineChartStatisticDTO(Integer timeUnit, Long quantity) {
        this.timeUnit = timeUnit;
        this.quantity = quantity;
    }

    public LineChartStatisticDTO(Integer timeUnit, Double price) {
        this.timeUnit = timeUnit;
        this.price = price;
    }

    public Integer getTimeUnit() {
        return timeUnit;
    }

    public void setTimeUnit(Integer timeUnit) {
        this.timeUnit = timeUnit;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
