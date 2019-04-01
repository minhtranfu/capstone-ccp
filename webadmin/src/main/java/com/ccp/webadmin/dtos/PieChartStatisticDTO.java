package com.ccp.webadmin.dtos;

import java.io.Serializable;

public class PieChartStatisticDTO implements Serializable {


    private String type;

    private Long quantity;

    public PieChartStatisticDTO() {
    }

    public PieChartStatisticDTO(String type, Long quantity) {
        this.type = type;
        this.quantity = quantity;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }
}
