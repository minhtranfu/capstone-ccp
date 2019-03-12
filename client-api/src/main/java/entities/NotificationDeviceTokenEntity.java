package entities;

import javax.json.bind.annotation.JsonbTransient;
import javax.persistence.*;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Entity
@Table(name = "notification_device_token", schema = "capstone_ccp")
@NamedQueries({
		@NamedQuery(name = "NotificationDeviceTokenEntity.removeByToken", query = "delete from NotificationDeviceTokenEntity t where t.registrationToken = :token and t.contractor.id = :contractorId")
		,@NamedQuery(name = "NotificationDeviceTokenEntity.findByTokenContractor", query = "select t from NotificationDeviceTokenEntity t where t.registrationToken = :token and t.contractor.id = :contractorId")
})
public class NotificationDeviceTokenEntity {
	private long id;
	private String registrationToken;
	private ContractorEntity contractor;
	private DeviceType deviceType;

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
	@NotNull
	@NotEmpty
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

	@Basic
	@Enumerated(EnumType.STRING)
	@Column(name = "device_type")
	public DeviceType getDeviceType() {
		return deviceType;
	}

	public void setDeviceType(DeviceType deviceType) {
		this.deviceType = deviceType;
	}

	public enum DeviceType {
		WEB,
		MOBILE,
		EXPO
	}
}
