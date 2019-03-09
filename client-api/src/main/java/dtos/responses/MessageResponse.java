package dtos.responses;

public class MessageResponse {
	private String message;
	private String stacktrace;

	public MessageResponse(String message) {
		this.message = message;
	}

	public MessageResponse(String message, String stacktrace) {
		this.message = message;
		this.stacktrace = stacktrace;
	}

	public String getStacktrace() {
		return stacktrace;
	}

	public void setStacktrace(String stacktrace) {
		this.stacktrace = stacktrace;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
