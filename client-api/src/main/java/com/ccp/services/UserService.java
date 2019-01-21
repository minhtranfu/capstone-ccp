package com.ccp.services;


import com.ccp.utils.DBUtils;

import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("/user")
public class UserService {
    private static EntityManager manager = null;

    @GET
    @Path("/asd")
    @Produces(MediaType.TEXT_PLAIN)
    public String allUser() {
        manager = DBUtils.getEntityManager();

//        List<Equipment> resultList = manager.createQuery("Select a From Equipment a", Equipment.class).getResultList();
//        for (Employee next : resultList) {
//            System.out.println("next employee: " + next);
//        }

//        return resultList;
        return "asdasdasdasdsad asdasd asd asdasd";
    }
}
