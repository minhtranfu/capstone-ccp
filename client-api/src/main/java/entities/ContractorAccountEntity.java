package entities;

import javax.persistence.*;

@Entity
@Table(name = "contractor_account",schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "ContractorAccountEntity.validateAccount", query = "select e from ContractorAccountEntity  e where e.username = :username and e.password = :password")
		,@NamedQuery(name = "ContractorAccountEntity.findByUsername", query = "select e from ContractorAccountEntity  e where e.username = :username ")

})
public class ContractorAccountEntity
{

	private long id;
	private String username;
	private String password;

	private ContractorEntity contractor;
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

	@ManyToOne
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractorAccount) {
		this.contractor = contractorAccount;
	}
}
