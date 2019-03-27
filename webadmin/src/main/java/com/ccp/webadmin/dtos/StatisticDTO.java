package com.ccp.webadmin.dtos;

import java.io.Serializable;

public class StatisticDTO implements Serializable {


    private Integer equipment;

    private Integer material;

    public StatisticDTO() {
    }

    public Integer getEquipment() {
        return equipment;
    }

    public void setEquipment(Integer equipment) {
        this.equipment = equipment;
    }

    public Integer getMaterial() {
        return material;
    }

    public void setMaterial(Integer material) {
        this.material = material;
    }
}
