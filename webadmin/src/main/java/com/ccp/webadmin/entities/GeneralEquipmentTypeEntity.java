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

    @Column(name = "is_deleted")
    private boolean isDeleted;

    public GeneralEquipmentTypeEntity() {
    }

    public GeneralEquipmentTypeEntity(String name, boolean isDeleted) {
        this.name = name;
        this.isDeleted = isDeleted;
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

    public boolean isIs_deleted() {
        return isDeleted;
    }

    public void setIs_deleted(boolean is_delete) {
        this.isDeleted = isDeleted;
    }
}
