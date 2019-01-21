package com.ccp.services;


import com.ccp.utils.DBUtils;

import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Path("/equipments")
public class EquipmentService {
    private static EntityManager manager = DBUtils.getEntityManager();
        @GET
        @Path("{path:.*}")
        public String getResponse(@PathParam("path") String path) {
            return "dummy-response for " + path;
        }
//    @GET
//    @Path("/types")
//    @Produces(MediaType.APPLICATION_JSON)
//    public List<EquipmentType> getEquipmentTypes() {
////        List<EquipmentType> resultList = null;
//        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();
////        return Response.ok(resultList).header(
////                "Access-Control-Allow-Origin", "*")
////                .header(
////                "Access-Control-Allow-Credentials", "true")
////                .header(
////                "Access-Control-Allow-Headers",
////                "origin, content-type, accept, authorization")
////                .header(
////                "Access-Control-Allow-Methods",
////                "GET, POST, PUT, DELETE, OPTIONS, HEAD").build();
//
//        return resultList;
//    }
//
//    @GET
//    @Path("/types/{id : \\d+}/infos")
//    @Produces(MediaType.APPLICATION_JSON)
//    public List<EquipmentTypeInfo> getEquipmentTypeInfos(@PathParam("id") int id) {
//        List<EquipmentTypeInfo> resultList = null;
////        List<EquipmentTypeInfo> resultList = manager.createQuery("SELECT eti FROM EquipmentTypeInfo eti WHERE eti.equipmentTypeId = ? ORDER BY eti.weight", EquipmentTypeInfo.class).setParameter(1, id).getResultList();
////
//        return resultList;
//    }
}
