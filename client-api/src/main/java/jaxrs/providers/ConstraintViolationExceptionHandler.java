package jaxrs.providers;

import dtos.responses.MessageResponse;
import test.shit.Message;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.ExceptionMapper;
import javax.ws.rs.ext.Provider;
import java.util.ArrayList;
import java.util.List;

@Provider
public class ConstraintViolationExceptionHandler implements ExceptionMapper<ConstraintViolationException> {
	@Override
	public Response toResponse(final ConstraintViolationException exception) {
		return Response.status(Response.Status.BAD_REQUEST)
				.entity(prepareMessage(exception))
				.type(MediaType.APPLICATION_JSON_TYPE)
				.build();
	}

	private List<MessageResponse> prepareMessage(ConstraintViolationException exception) {

		ArrayList<MessageResponse> messageResponses = new ArrayList<>();
		for (ConstraintViolation<?> cv : exception.getConstraintViolations()) {
			messageResponses.add(new MessageResponse("["+cv.getPropertyPath() + "] " + cv.getMessage()));
		}
		return messageResponses;
	}
}
