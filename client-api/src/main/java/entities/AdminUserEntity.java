package entities;

import org.hibernate.annotations.Where;

import javax.persistence.*;

@Entity
@Where(clause = "is_deleted=0")
@Table(name = "admin_user", schema = "capstone_ccp", catalog = "")
public class AdminUserEntity {
	private long id;
	private String name;
	private Boolean isMale;
	private String phone;
	private String email;
	private Integer roleId;

	@Id
	@GeneratedValue
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "name", nullable = true, length = 255)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Basic
	@Column(name = "is_male", nullable = true)
	public Boolean getMale() {
		return isMale;
	}

	public void setMale(Boolean male) {
		isMale = male;
	}

	@Basic
	@Column(name = "phone", nullable = true, length = 45)
	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Basic
	@Column(name = "email", nullable = true, length = 255)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}


	@Basic
	@Column(name = "role_id", nullable = true)
	public Integer getRoleId() {
		return roleId;
	}

	public void setRoleId(Integer roleId) {
		this.roleId = roleId;
	}


}
