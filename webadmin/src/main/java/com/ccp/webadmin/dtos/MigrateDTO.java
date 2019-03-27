package com.ccp.webadmin.dtos;

import java.io.Serializable;

public class MigrateDTO implements Serializable {


    private Integer fromCate;

    private Integer toCate;

    public MigrateDTO() {
    }

    public Integer getFromCate() {
        return fromCate;
    }

    public void setFromCate(Integer fromCate) {
        this.fromCate = fromCate;
    }

    public Integer getToCate() {
        return toCate;
    }

    public void setToCate(Integer toCate) {
        this.toCate = toCate;
    }
}
