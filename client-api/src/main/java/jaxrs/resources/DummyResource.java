package jaxrs.resources;

import jdk.nashorn.internal.objects.annotations.Getter;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.awt.*;

@Path("dummy")
@Produces(MediaType.APPLICATION_JSON)
public class DummyResource {
	@GET
	public String getMessage() {
		return "Hello new dummy!";
	}
}
