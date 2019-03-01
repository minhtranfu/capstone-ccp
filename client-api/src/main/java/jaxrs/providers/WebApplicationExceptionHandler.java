package jaxrs.providers;

import dtos.responses.MessageResponse;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;

@Provider
public class WebApplicationExceptionHandler implements ExceptionMapper<WebApplicationException> {
	@Override
	public Response toResponse(WebApplicationException exception) {

		return Response.status(exception.getResponse().getStatus())
				.entity(new MessageResponse(exception.getMessage()))
				.build();
	}
}
