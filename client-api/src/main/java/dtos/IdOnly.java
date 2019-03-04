package dtos;

import javax.validation.constraints.NotNull;

public class IdOnly {
	@NotNull
	private long id;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}
}
