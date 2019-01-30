package entities;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "cart_request", schema = "capstone_ccp", catalog = "")
public class CartRequestEntity {
	private long id;
	private Timestamp beginDate;
	private Timestamp endDate;
	private String requesterAddress;
	private Double requesterLong;
	private Double requesterLat;
	private Timestamp createdTime;
	private Timestamp updatedTime;

	private ContractorEntity contractor;

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
	@Column(name = "begin_date", nullable = true)
	public Timestamp getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Timestamp beginDate) {
		this.beginDate = beginDate;
	}

	@Basic
	@Column(name = "end_date", nullable = true)
	public Timestamp getEndDate() {
		return endDate;
	}

	public void setEndDate(Timestamp endDate) {
		this.endDate = endDate;
	}

	@Basic
	@Column(name = "requester_address", nullable = true, length = 255)
	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	@Basic
	@Column(name = "requester_long", nullable = true, precision = 0)
	public Double getRequesterLong() {
		return requesterLong;
	}

	public void setRequesterLong(Double requesterLong) {
		this.requesterLong = requesterLong;
	}

	@Basic
	@Column(name = "requester_lat", nullable = true, precision = 0)
	public Double getRequesterLat() {
		return requesterLat;
	}

	public void setRequesterLat(Double requesterLat) {
		this.requesterLat = requesterLat;
	}

	@Basic
	@Column(name = "created_time", insertable=false, updatable = false)
	public Timestamp getCreatedTime() {
		return createdTime;
	}

	public void setCreatedTime(Timestamp createdTime) {
		this.createdTime = createdTime;
	}

	@Basic
@Column(name = "updated_time", insertable=false, updatable = false)
	public Timestamp getUpdatedTime() {
		return updatedTime;
	}

	public void setUpdatedTime(Timestamp updatedTime) {
		this.updatedTime = updatedTime;
	}

	@OneToOne
	@JoinColumn(name = "contractor_id")
	public ContractorEntity getContractor() {
		return contractor;
	}

	public void setContractor(ContractorEntity contractor) {
		this.contractor = contractor;
	}
}
