package dtos.wrappers;

import dtos.requests.HiringTransactionRequest;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;

import java.sql.Date;
import java.sql.Timestamp;

public class IndependentHiringTransactionWrapper {

	private long id;
	private HiringTransactionEntity.Status status;
	private Integer dailyPrice;
	private Integer deliveryPrice;
	private Date beginDate;
	private Date endDate;

	private String equipmentAddress;
	private double equipmentLatitude;
	private double equipmentLongitude;

	private String requesterAddress;
	private double requesterLatitude;
	private double requesterLongitude;
	private long equipmentId;

	public IndependentHiringTransactionWrapper(HiringTransactionEntity hiringTransactionEntity) {
		this.id = hiringTransactionEntity.getId();
		this.status = hiringTransactionEntity.getStatus();
		this.dailyPrice = hiringTransactionEntity.getDailyPrice();
		this.deliveryPrice = hiringTransactionEntity.getDeliveryPrice();
		this.beginDate = hiringTransactionEntity.getBeginDate();
		this.endDate = hiringTransactionEntity.getEndDate();
		this.equipmentAddress = hiringTransactionEntity.getEquipmentAddress();
		this.equipmentLatitude = hiringTransactionEntity.getEquipmentLatitude();
		this.equipmentLongitude = hiringTransactionEntity.getEquipmentLongitude();
		this.requesterAddress = hiringTransactionEntity.getRequesterAddress();
		this.requesterLatitude = hiringTransactionEntity.getRequesterLatitude();
		this.requesterLongitude = hiringTransactionEntity.getRequesterLongitude();
		this.equipmentId = hiringTransactionEntity.getEquipment().getId();
	}


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public HiringTransactionEntity.Status getStatus() {
		return status;
	}

	public void setStatus(HiringTransactionEntity.Status status) {
		this.status = status;
	}

	public Integer getDailyPrice() {
		return dailyPrice;
	}

	public void setDailyPrice(Integer dailyPrice) {
		this.dailyPrice = dailyPrice;
	}

	public Integer getDeliveryPrice() {
		return deliveryPrice;
	}

	public void setDeliveryPrice(Integer deliveryPrice) {
		this.deliveryPrice = deliveryPrice;
	}


	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getEquipmentAddress() {
		return equipmentAddress;
	}

	public void setEquipmentAddress(String equipmentAddress) {
		this.equipmentAddress = equipmentAddress;
	}

	public double getEquipmentLatitude() {
		return equipmentLatitude;
	}

	public void setEquipmentLatitude(double equipmentLatitude) {
		this.equipmentLatitude = equipmentLatitude;
	}

	public double getEquipmentLongitude() {
		return equipmentLongitude;
	}

	public void setEquipmentLongitude(double equipmentLongitude) {
		this.equipmentLongitude = equipmentLongitude;
	}

	public String getRequesterAddress() {
		return requesterAddress;
	}

	public void setRequesterAddress(String requesterAddress) {
		this.requesterAddress = requesterAddress;
	}

	public double getRequesterLatitude() {
		return requesterLatitude;
	}

	public void setRequesterLatitude(double requesterLatitude) {
		this.requesterLatitude = requesterLatitude;
	}

	public double getRequesterLongitude() {
		return requesterLongitude;
	}

	public void setRequesterLongitude(double requesterLongitude) {
		this.requesterLongitude = requesterLongitude;
	}


	public long getEquipmentId() {
		return equipmentId;
	}

	public void setEquipmentId(long equipmentId) {
		this.equipmentId = equipmentId;
	}
}
