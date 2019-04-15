package dtos.notifications;

public class NotificationDTO {
	private String title;
	private String content;
	private String clickAction;
	private long contractorId;

	public NotificationDTO() {
	}

	public NotificationDTO(String title, String content, long contractorId) {
		this.title = title;
		this.content = content;
		this.contractorId = contractorId;
		clickAction = "";
	}

	public NotificationDTO(String title, String content, long contractorId, String clickAction) {
		this.title = title;
		this.content = content;
		this.clickAction = clickAction;
		this.contractorId = contractorId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getClickAction() {
		return clickAction;
	}

	public void setClickAction(String clickAction) {
		this.clickAction = clickAction;
	}

	public long getContractorId() {
		return contractorId;
	}

	public void setContractorId(long contractorId) {


		this.contractorId = contractorId;
	}

	public enum ClickActionDestination {

		EQUIPMENTS("equipments"),
		HIRING_TRANSACTIONS("hiringTransactions"),
		TRANSACTION_DATE_CHANGE_REQUESTS("transactionDateChangeRequests"),
		DEBRIS_TRANSACTIONS("debrisTransactions"),
		DEBRIS_FEEDBACK("debrisFeedbacks"),
		MATERIAL_TRANSACTIONS("materialTransactions")
		;

		String destination;

		ClickActionDestination(String destination) {
			this.destination = destination;
		}

		public String getDestination() {
			return destination;
		}
	}

	public static String makeClickAction(ClickActionDestination clickActionDestination, long id) {
		return clickActionDestination.getDestination() +"/"+ id;
	}

	@Override
	public String toString() {
		return "NotificationDTO{" +
				"title='" + title + '\'' +
				", content='" + content + '\'' +
				", clickAction='" + clickAction + '\'' +
				", contractorId=" + contractorId +
				'}';
	}
}
