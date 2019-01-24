package entities;

import javax.persistence.*;

@Entity(name = "equipment")
public class Equipment {
    @Id
    @GeneratedValue
    @Column(name = "id")
    private long id;

    @Column(name = "description")
    private String description;


    @Column(name="equipment_type_id")
    private long equipmentTypeId;

    public Equipment() {}

    public Equipment(String description, long equipmentTypeId) {
        this.description = description;
        this.equipmentTypeId = equipmentTypeId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public long getEquipmentTypeId() {
        return equipmentTypeId;
    }

    public void setEquipmentTypeId(long equipmentTypeId) {
        this.equipmentTypeId = equipmentTypeId;
    }

    @Override
    public String toString() {
        return id + " | " + description + " | " + equipmentTypeId;
    }
}
