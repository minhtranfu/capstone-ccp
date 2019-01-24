package entities;

import javax.persistence.*;

@Entity
@Table(name="equipment_type_info")
public class EquipmentTypeInfo {
    @Id
    @GeneratedValue
    private int id;

    private String name;
    private String unit;
    @Column(name="equipment_type_id")
    private int equipmentTypeId;
    private int weight;

    public EquipmentTypeInfo() {
    }

    public EquipmentTypeInfo(String name, String unit, int equipmentTypeId) {
        this.name = name;
        this.unit = unit;
        this.equipmentTypeId = equipmentTypeId;
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

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public int getEquipmentTypeId() {
        return equipmentTypeId;
    }

    public void setEquipmentTypeId(int equipmentTypeId) {
        this.equipmentTypeId = equipmentTypeId;
    }

    public int getWeight() {
        return weight;
    }

    public void setWeight(int weight) {
        this.weight = weight;
    }
}
