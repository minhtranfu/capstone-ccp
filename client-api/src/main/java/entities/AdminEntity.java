package entities;

import javax.persistence.*;

@Entity
@Table(name = "admin", schema = "capstone_ccp", catalog = "")
public class AdminEntity {
	private long id;
	private String name;
	private Integer accountId;

	@Id
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
	@Column(name = "account_id", nullable = true)
	public Integer getAccountId() {
		return accountId;
	}

	public void setAccountId(Integer accountId) {
		this.accountId = accountId;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;

		AdminEntity that = (AdminEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (accountId != null ? !accountId.equals(that.accountId) : that.accountId != null) return false;

		return true;
	}

}
