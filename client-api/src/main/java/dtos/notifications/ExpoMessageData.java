package dtos.notifications;

public class ExpoMessageData {
	private String sound;
	private int badge;
	private String body;
	private String title;
	private String subtitle;
	private String clickAction;


	public ExpoMessageData() {
	}

	public ExpoMessageData(String body, String title, String clickAction) {
		this.body = body;
		this.title = title;
		this.sound = "default";
		//this to clear the badge
		this.clickAction = clickAction;
		this.badge = 0;
		this.subtitle = null;
	}

	public String getSound() {
		return sound;
	}

	public void setSound(String sound) {
		this.sound = sound;
	}

	public int getBadge() {
		return badge;
	}

	public void setBadge(int badge) {
		this.badge = badge;
	}

	public String getBody() {
		return body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(String subtitle) {


		this.subtitle = subtitle;
	}

	public String getClickAction() {
		return clickAction;
	}

	public void setClickAction(String clickAction) {
		this.clickAction = clickAction;
	}
}


