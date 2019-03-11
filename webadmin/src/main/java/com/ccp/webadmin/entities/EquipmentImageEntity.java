package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "equipment_image")
//@Where(clause = "is_deleted='false'")
public class EquipmentImageEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "url")
    private String name;

    @ManyToOne
    @JoinColumn(name = "equipment_id")
    private EquipmentEntity equipmentEntity;


    public EquipmentImageEntity() {
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

    public EquipmentEntity getEquipmentEntity() {
        return equipmentEntity;
    }

    public void setEquipmentEntity(EquipmentEntity equipmentEntity) {
        this.equipmentEntity = equipmentEntity;
    }
}
