package jaxrs.providers;

import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.container.ContainerResponseFilter;
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.UriInfo;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

//@Provider
public class LogFilter implements ContainerRequestFilter, ContainerResponseFilter {

    public void filter(ContainerRequestContext reqContext) throws IOException {
        System.out.println("-- req info --");
        log(reqContext.getUriInfo(), reqContext.getHeaders());

    }

    public void filter(ContainerRequestContext reqContext,
                       ContainerResponseContext resContext) throws IOException {
        System.out.println("-- res info --");
        resContext.getHeaders().add("asdsadsad", "asdsadsadsadsadsad");
        log(reqContext.getUriInfo(), resContext.getHeaders());


    }

    private void log(UriInfo uriInfo, MultivaluedMap<String, ?> headers) {
        System.out.println("Path: " + uriInfo.getPath());
//        headers.entrySet().forEach(h -> System.out.println(h.getKey() + " : " + h.getValue()));
    }
}
