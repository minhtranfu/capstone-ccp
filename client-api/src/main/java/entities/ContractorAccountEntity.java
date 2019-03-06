package entities;

import javax.annotation.Priority;
import javax.persistence.*;

@Entity
@Table(name = "contractor_account",schema = "capstone_ccp")
@NamedQuery(name = "ContractorAccountEntity.validateAccount", query = "select count(e) > 0 from ContractorAccountEntity  e where e.username = :username and e.password = :password")
public class ContractorAccountEntity
{

	private long id;
	private String username;
	private String password;

	public ContractorAccountEntity() {
	}

	@Id
	@GeneratedValue
	@Column(name = "id")
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "username")
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Basic
	@Column(name = "password")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
