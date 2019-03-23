package dtos.requests;

import dtos.IdOnly;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;

public class DebrisPostPostRequest extends DebrisPostRequest{
	@NotNull
	private List<@Valid IdOnly> debrisImages;

	public List<IdOnly> getDebrisImages() {
		return debrisImages;
	}

	public void setDebrisImages(List<IdOnly> debrisImages) {
		this.debrisImages = debrisImages;
	}
}
