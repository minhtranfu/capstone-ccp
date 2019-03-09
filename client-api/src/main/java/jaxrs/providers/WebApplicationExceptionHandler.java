package jaxrs.providers;

import dtos.responses.MessageResponse;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.apache.geronimo.mail.util.StringBufferOutputStream;

import javax.ws.rs.WebApplicationException;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.Arrays;

@Provider
public class WebApplicationExceptionHandler implements ExceptionMapper<WebApplicationException> {
	@Override
	public Response toResponse(WebApplicationException exception) {
//		String stackTrace = ExceptionUtils.getStackTrace(exception);
		return Response.status(exception.getResponse().getStatus())
				.entity(new MessageResponse(exception.getMessage()))
				.build();
	}
}
