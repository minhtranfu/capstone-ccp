package com.ccp.webadmin.entities;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

@Entity
@Table(name = "equipment_type")
public class EquipmentTypeEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required not empty")
    @Size(min = 3, message = "Equipment's name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "general_equipment_type_id")
    private GeneralEquipmentTypeEntity generalEquipmentType;

    public EquipmentTypeEntity() {
    }

    public EquipmentTypeEntity(String name, GeneralEquipmentTypeEntity generalEquipmentType) {
        this.name = name;
        this.generalEquipmentType = generalEquipmentType;
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

    public GeneralEquipmentTypeEntity getGeneralEquipmentType() {
        return generalEquipmentType;
    }

    public void setGeneralEquipmentType(GeneralEquipmentTypeEntity generalEquipmentType) {
        this.generalEquipmentType = generalEquipmentType;
    }
}
