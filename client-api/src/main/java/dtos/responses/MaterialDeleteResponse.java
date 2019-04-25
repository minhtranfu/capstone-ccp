package dtos.responses;

public class MaterialDeleteResponse {
	private int deniedTransactionsTotal;
	private long deletedMaterialId;

	public MaterialDeleteResponse() {
	}

	public int getDeniedTransactionsTotal() {
		return deniedTransactionsTotal;
	}

	public void setDeniedTransactionsTotal(int deniedTransactionsTotal) {
		this.deniedTransactionsTotal = deniedTransactionsTotal;
	}

	public long getDeletedMaterialId() {
		return deletedMaterialId;
	}

	public void setDeletedMaterialId(long deletedMaterialId) {
		this.deletedMaterialId = deletedMaterialId;
	}
}
