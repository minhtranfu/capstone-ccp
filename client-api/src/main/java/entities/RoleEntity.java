package entities;

import javax.persistence.*;

@Entity
@Table(name = "role", schema = "capstone_ccp")
public class RoleEntity {
	private long id;
	private String roleName;

	@Id
	@GeneratedValue
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Column(name = "role_name")
	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
}
