package com.ccp.webadmin.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "role")
public class RoleEntity implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(name = "role_name")
    private RoleName roleName;

    public RoleEntity() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public RoleName getRoleName() {
        return roleName;
    }

    public void setRoleName(RoleName roleName) {
        this.roleName = roleName;
    }

    public enum RoleName {
        ROLE_ADMIN("Admin"),
        ROLE_STAFF("Staff"),
        ;

        private String value;

        RoleName(String value) {
            this.value = value;
        }

        public String getValue() {
            return value;
        }
    }
}
