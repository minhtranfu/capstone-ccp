package utils;

import javax.ws.rs.core.Response;

public class CommonUtils {
    public static Response responseFilterOk(Object data) {
        return Response.ok(data).header(
                "Access-Control-Allow-Origin", "*")
                .header(
                        "Access-Control-Allow-Credentials", "true")
                .header(
                        "Access-Control-Allow-Headers",
                        "origin, content-type, accept, authorization")
                .header(
                        "Access-Control-Allow-Methods",
                        "GET, POST, PUT, DELETE, OPTIONS, HEAD").build();
    }
}
