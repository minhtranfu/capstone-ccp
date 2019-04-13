package dtos.requests;

import dtos.IdOnly;
import entities.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DebrisTransactionRequest {
	@Valid
	private IdOnly debrisPost;
	@Valid
	private IdOnly debrisBid;

	public DebrisTransactionRequest() {
	}

	public IdOnly getDebrisPost() {
		return debrisPost;
	}

	public void setDebrisPost(IdOnly debrisPost) {
		this.debrisPost = debrisPost;
	}

	public IdOnly getDebrisBid() {
		return debrisBid;
	}

	public void setDebrisBid(IdOnly debrisBid) {
		this.debrisBid = debrisBid;
	}
}
