package jaxrs;

import org.eclipse.microprofile.auth.LoginConfig;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/")
@LoginConfig(authMethod = "MP-JWT")
public class ApplicationConfig extends Application {
//    @Override
//    public Set<Class<?>> getClasses() {
//        return new HashSet(Arrays.asList(UserService.class));
//    }
}
