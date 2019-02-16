package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "additional_specs_field")
public class AdditionalSpecialFieldEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "name")
    private String name;
    @Column(name = "data_type")
    private String dataType;

    @ManyToOne
    @JoinColumn(name = "equipment_type_id")
    private EquipmentTypeEntity equipmentTypeEntity;

    public AdditionalSpecialFieldEntity() {
    }

    public AdditionalSpecialFieldEntity(EquipmentTypeEntity equipmentTypeEntity) {
        this.equipmentTypeEntity = equipmentTypeEntity;
    }

    public AdditionalSpecialFieldEntity(String name, String dataType, EquipmentTypeEntity equipmentTypeEntity) {
        this.name = name;
        this.dataType = dataType;
        this.equipmentTypeEntity = equipmentTypeEntity;
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

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public EquipmentTypeEntity getEquipmentTypeEntity() {
        return equipmentTypeEntity;
    }

    public void setEquipmentTypeEntity(EquipmentTypeEntity equipmentTypeEntity) {
        this.equipmentTypeEntity = equipmentTypeEntity;
    }
}
