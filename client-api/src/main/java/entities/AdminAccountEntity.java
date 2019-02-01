package entities;

import javax.persistence.*;

@Entity
@Table(name = "admin_account", schema = "capstone_ccp", catalog = "")
public class AdminAccountEntity {
	private long id;
	private String username;
	private String password;
	private long adminUserId;

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
	@Column(name = "username", nullable = true, length = 255)
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Basic
	@Column(name = "password", nullable = true, length = 255)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "admin_user_id")
	public long getAdminUserId() {
		return adminUserId;
	}

	public void setAdminUserId(long adminUserId) {
		this.adminUserId = adminUserId;
	}
}
