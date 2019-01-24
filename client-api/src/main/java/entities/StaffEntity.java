package entities;

import javax.persistence.*;

@Entity
@Table(name = "staff", schema = "capstone_ccp", catalog = "")
public class StaffEntity {
	private long id;
	private String name;
	private Boolean isMale;
	private String phone;
	private String email;
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

		StaffEntity that = (StaffEntity) o;

		if (id != that.id) return false;
		if (name != null ? !name.equals(that.name) : that.name != null) return false;
		if (isMale != null ? !isMale.equals(that.isMale) : that.isMale != null) return false;
		if (phone != null ? !phone.equals(that.phone) : that.phone != null) return false;
		if (email != null ? !email.equals(that.email) : that.email != null) return false;
		if (accountId != null ? !accountId.equals(that.accountId) : that.accountId != null) return false;

		return true;
	}

}
