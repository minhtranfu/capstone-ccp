package test.shit;

import javax.enterprise.context.RequestScoped;

@RequestScoped
public class MessageB implements Message {
	public MessageB() { }

	public String get() {
		return "message BBBBBB";
	}
}