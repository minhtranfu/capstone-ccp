package com.example.entities;


import javax.persistence.*;

//@Entity
@Table(name="equipment_type")
public class EquipmentType {
    @Id
    @GeneratedValue
    private int id;

    private String name;
    @Column(name="is_active")
    private int isActive;

    public EquipmentType() {
    }

    public EquipmentType(String name) {
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getIsActive() {
        return isActive;
    }

    public void setIsActive(int isActive) {
        this.isActive = isActive;
    }
}
