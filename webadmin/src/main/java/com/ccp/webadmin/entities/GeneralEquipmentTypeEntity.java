package com.ccp.webadmin.entities;

import javax.persistence.*;

@Entity
@Table(name = "general_equipment_type")
public class GeneralEquipmentTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;

    @Column(name = "is_delete")
    private boolean is_delete;

    public GeneralEquipmentTypeEntity() {
    }

    public GeneralEquipmentTypeEntity(String name, boolean is_delete) {
        this.name = name;
        this.is_delete = is_delete;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isIs_delete() {
        return is_delete;
    }

    public void setIs_delete(boolean is_delete) {
        this.is_delete = is_delete;
    }
}
