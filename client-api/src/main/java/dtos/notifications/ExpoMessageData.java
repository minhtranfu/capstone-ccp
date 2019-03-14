package dtos.notifications;

public class ExpoMessageData {
	private String sound;
	private int badge;
	private String body;
	private String title;
	private String subtitle;

	public ExpoMessageData() {
	}

	public ExpoMessageData(String sound, int badge, String body, String title, String subtitle) {
		this.sound = sound;
		this.badge = badge;
		this.body = body;
		this.title = title;
		this.subtitle = subtitle;
	}

	public ExpoMessageData(String body, String title) {
		this.body = body;
		this.title = title;
		this.sound = "default";
		//this to clear the badge
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
}


