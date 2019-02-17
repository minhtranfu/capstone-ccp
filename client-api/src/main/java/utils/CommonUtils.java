package utils;

import dtos.responses.MessageResponse;

import javax.ws.rs.core.Response;

public class CommonUtils {
    public static Response responseFilterOk(Object data) {
		return addFilterHeader(Response.ok(data)).build();
    }

    public static Response.ResponseBuilder addFilterHeader(Response.ResponseBuilder responseBuilder) {
        return responseBuilder.header(
				"Access-Control-Allow-Origin", "*")
				.header(
						"Access-Control-Allow-Credentials", "true")
				.header(
						"Access-Control-Allow-Headers",
						"origin, content-type, accept, authorization")
				.header(
						"Access-Control-Allow-Methods",
						"GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }

	public static Response responseFilterBadRequest(Object data) {
		return addFilterHeader(Response.status(Response.Status.BAD_REQUEST)).entity(data).build();
	}



	public static Response responseError(Response.Status status, String message) {
		return Response.status(status).entity(new MessageResponse(message)).build();
	}




}
