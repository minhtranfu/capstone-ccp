package com.ccp.webadmin.entities;

import org.hibernate.annotations.Where;
import org.springframework.format.annotation.DateTimeFormat;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.sql.Timestamp;

@Entity
@Table(name = "material_type")

public class MaterialTypeEntity implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NotNull(message = "Name is required not empty")
    @Size(min = 3, message = "Equipment's name required more than 3 letters")
    @Column(name = "name")
    private String name;

    @NotNull(message = "Unit is required not empty")
    @Size(min = 3, message = "Material's unit required more than 3 letters")
    @Column(name = "unit")
    private String unit;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @ManyToOne
    @JoinColumn(name = "general_material_type_id")
    private GeneralMaterialTypeEntity generalMaterialTypeEntity ;

    @Column(name = "created_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private Timestamp createdTime;

    @Column(name = "updated_time", insertable = false, updatable = false)
    @DateTimeFormat(pattern = "hh:mm:ss dd/MM/yyyy")
    private Timestamp updatedTime;

    public MaterialTypeEntity() {
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

    public GeneralMaterialTypeEntity getGeneralMaterialTypeEntity() {
        return generalMaterialTypeEntity;
    }

    public void setGeneralMaterialTypeEntity(GeneralMaterialTypeEntity generalMaterialTypeEntity) {
        this.generalMaterialTypeEntity = generalMaterialTypeEntity;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
    }

    public Timestamp getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(Timestamp createdTime) {
        this.createdTime = createdTime;
    }

    public Timestamp getUpdatedTime() {
        return updatedTime;
    }

    public void setUpdatedTime(Timestamp updatedTime) {
        this.updatedTime = updatedTime;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
