package dtos.notifications;

public class ExpoMessageWrapper extends ExpoMessageData {
	private String to;
	private ExpoMessageData data;

	public String getTo() {
		return to;
	}

	public void setTo(String to) {
		this.to = to;
	}

	public ExpoMessageData getData() {
		return data;
	}

	public void setData(ExpoMessageData data) {
		this.data = data;
	}

	public ExpoMessageWrapper() {
	}


	public ExpoMessageWrapper(String to, ExpoMessageData data) {
		super(data);
		this.to = to;
		this.data = data;
	}


}
