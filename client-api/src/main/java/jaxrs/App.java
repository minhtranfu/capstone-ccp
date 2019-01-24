package jaxrs;

import jaxrs.services.UserService;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@ApplicationPath("/")
public class App extends Application {
//    @Override
//    public Set<Class<?>> getClasses() {
//        return new HashSet(Arrays.asList(UserService.class));
//    }
}
