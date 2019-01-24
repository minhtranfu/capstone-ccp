package jaxrs.providers;

import com.sun.jersey.spi.container.ContainerRequest;
import com.sun.jersey.spi.container.ContainerResponse;
import com.sun.jersey.spi.container.ContainerResponseFilter;
import com.sun.jersey.spi.container.ResourceFilter;
//import com.sun.jersey.spi.container.ResourceFilter;

import javax.ws.rs.container.ContainerRequestContext;
//import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.container.ContainerResponseContext;
import javax.ws.rs.ext.Provider;
import java.io.IOException;

//@Provider
//public class CorsFilter implements ContainerResponseFilter, ContainerRequestFilter {
//
//    public void filter(ContainerRequestContext requestContext,
//                       ContainerResponseContext responseContext) throws IOException {
//        responseContext.getHeaders().add(
//                "Access-Control-Allow-Origin", "*");
//        responseContext.getHeaders().add(
//                "Access-Control-Allow-Credentials", "true");
//        responseContext.getHeaders().add(
//                "Access-Control-Allow-Headers",
//                "origin, content-type, accept, authorization");
//        responseContext.getHeaders().add(
//                "Access-Control-Allow-Methods",
//                "GET, POST, PUT, DELETE, OPTIONS, HEAD");
//    }
//
//    public void filter(ContainerRequestContext containerRequestContext) throws IOException {
//
//    }
//}

@Provider
public class CorsFilter implements ContainerResponseFilter, ResourceFilter {
//    public ContainerRequest filter(ContainerRequest containerRequest) {
//        // Do something with the incoming request here
//        return containerRequest;
//    }
//
//    public ContainerResponse filter(ContainerRequest containerRequest, ContainerResponse containerResponse) {
//        // Do something with the outgoing response here
//        return containerResponse;
//    }

    public void filter(ContainerRequestContext containerRequestContext) throws IOException {

    }

    public void filter(ContainerRequestContext containerRequestContext, ContainerResponseContext containerResponseContext) throws IOException {
        containerResponseContext.getHeaders().add(
                "Access-Control-Allow-Origin", "*");
        containerResponseContext.getHeaders().add(
                "Access-Control-Allow-Credentials", "true");
        containerResponseContext.getHeaders().add(
                "Access-Control-Allow-Headers",
                "origin, content-type, accept, authorization");
        containerResponseContext.getHeaders().add(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS, HEAD");
    }

    public com.sun.jersey.spi.container.ContainerRequestFilter getRequestFilter() {
        return null;
    }

    public com.sun.jersey.spi.container.ContainerResponseFilter getResponseFilter() {
        return this;
    }

    public ContainerResponse filter(ContainerRequest containerRequest, ContainerResponse containerResponse) {

        containerResponse.getHttpHeaders().add(
                "Access-Control-Allow-Origin", "*");
        containerResponse.getHttpHeaders().add(
                "Access-Control-Allow-Credentials", "true");
        containerResponse.getHttpHeaders().add(
                "Access-Control-Allow-Headers",
                "origin, content-type, accept, authorization");
        containerResponse.getHttpHeaders().add(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS, HEAD");
        System.out.println("asdasdasd asdsad asdasdsadasdsad");
        return containerResponse;
    }
}