package jaxrs.services;

//import com.sun.jersey.spi.container.ResourceFilters;
import jaxrs.providers.CorsFilter;
import utils.CommonUtils;
import utils.DBUtils;

//import javax.enterprise.context.RequestScoped;
import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/user")
//@ResourceFilters(CorsFilter.class)
//@RequestScoped
public class UserService {
    private static EntityManager manager = DBUtils.getEntityManager();

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response allUser() {

        List<Equipment> resultList = manager.createQuery("Select a From Equipment a", Equipment.class).getResultList();

        return CommonUtils.responseFilter(resultList);
    }
}
