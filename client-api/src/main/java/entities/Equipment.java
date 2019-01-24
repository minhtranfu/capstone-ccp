package entities;

import javax.persistence.*;

@Entity
public class Equipment {
    @Id
    @GeneratedValue
    private long id;

    private String description;
    @Column(name="equip_type_id")
    private long equipTypeId;

    public Equipment() {}

    public Equipment(String description, long equipTypeId) {
        this.description = description;
        this.equipTypeId = equipTypeId;
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

    public long getEquipTypeId() {
        return equipTypeId;
    }

    public void setEquipTypeId(long equipTypeId) {
        this.equipTypeId = equipTypeId;
    }

    @Override
    public String toString() {
        return id + " | " + description + " | " + equipTypeId;
    }
}
