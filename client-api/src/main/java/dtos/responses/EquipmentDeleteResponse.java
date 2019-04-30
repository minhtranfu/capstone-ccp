package dtos.responses;

import dtos.IdOnly;

import java.util.List;

public class EquipmentDeleteResponse {
	private int deniedTransactionsTotal;
	private long deletedEquipmentId;
	public EquipmentDeleteResponse() {
	}

	public int getDeniedTransactionsTotal() {
		return deniedTransactionsTotal;
	}

	public void setDeniedTransactionsTotal(int deniedTransactionsTotal) {
		this.deniedTransactionsTotal = deniedTransactionsTotal;
	}

	public long getDeletedEquipmentId() {
		return deletedEquipmentId;
	}

	public void setDeletedEquipmentId(long deletedEquipmentId) {
		this.deletedEquipmentId = deletedEquipmentId;
	}
}
