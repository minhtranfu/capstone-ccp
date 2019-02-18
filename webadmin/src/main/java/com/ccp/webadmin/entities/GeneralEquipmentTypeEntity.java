package com.ccp.webadmin.entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Entity
@Table(name = "general_equipment_type")
//@Where(clause = "is_deleted == 0")
public class GeneralEquipmentTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Size(min = 3, message = "Name required more than 3 letters")
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
