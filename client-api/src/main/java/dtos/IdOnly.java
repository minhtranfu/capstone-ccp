package dtos;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

public class IdOnly {
	@NotNull
	@Positive
	private long id;


	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public IdOnly(@NotNull @Positive long id) {
		this.id = id;
	}

	public IdOnly() {
	}
}
