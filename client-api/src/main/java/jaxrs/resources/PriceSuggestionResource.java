package jaxrs.resources;

import managers.PriceSuggestionCalculator;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

@Path("suggestPrice")
@Produces(MediaType.APPLICATION_JSON)
public class PriceSuggestionResource {
	@Inject
	PriceSuggestionCalculator priceSuggestionCalculator;

	@GET
	@Path("train")
	public Response train() {
		priceSuggestionCalculator.trainModel();
		return Response.ok().build();
	}
}

