package dtos.queryResults;

public class MatchedSubscriptionResult {
	private long equipmentId;
	private long subscriptionId;
	private long contractorId;

	public MatchedSubscriptionResult(long equipmentId, long subscriptionId, long contractorId) {
		this.equipmentId = equipmentId;
		this.subscriptionId = subscriptionId;
		this.contractorId = contractorId;
	}

	public long getEquipmentId() {
		return equipmentId;
	}

	public long getSubscriptionId() {
		return subscriptionId;
	}

	public long getContractorId() {
		return contractorId;
	}

	@Override
	public String toString() {
		return "MatchedSubscriptionResult{" +
				"equipmentId=" + equipmentId +
				", subscriptionId=" + subscriptionId +
				", contractorId=" + contractorId +
				'}';
	}
}
