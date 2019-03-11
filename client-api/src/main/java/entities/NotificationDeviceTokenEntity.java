package entities;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "notification_device_token", schema = "capstone_ccp")
public class NotificationDeviceTokenEntity {
	private long id;
	private String registrationToken;
	private ContractorEntity contractor;

	@Id
	@Column(name = "id", nullable = false)
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	@Basic
	@Column(name = "registrationToken", nullable = true, length = 256)
	public String getRegistrationToken() {
		return registrationToken;
	}

	public void setRegistrationToken(String registrationToken) {
		this.registrationToken = registrationToken;
	}


	@ManyToOne
	@JoinColumn(name = "contractor_id")
	@JsonbTransient
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}
}
