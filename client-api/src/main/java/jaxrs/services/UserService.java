package jaxrs.services;

import com.sun.jersey.spi.container.ResourceFilters;
import entities.Equipment;
import jaxrs.providers.CorsFilter;
import utils.CommonUtils;
import utils.DBUtils;

import javax.ejb.Stateless;
import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceUnit;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/user")
@ResourceFilters(CorsFilter.class)
@RequestScoped
public class UserService {
    private static EntityManager manager = DBUtils.getEntityManager();




    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response allUser() {

        List<Equipment> resultList = manager.createQuery("Select a From equipment a", Equipment.class).getResultList();

        return CommonUtils.responseFilter(resultList);
    }
}
