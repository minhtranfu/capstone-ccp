package jaxrs.services;

import dao.EquipmentDAO;
import dao.EquipmentTypeDAO;
import entities.EquipmentEntity;
import entities.EquipmentTypeEntity;
import utils.CommonUtils;
import utils.DBUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentService {

	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();


	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return CommonUtils.responseFilterOk(EquipmentDAO.getInstance().findByID(id));
	}

	@POST
	public Response postEquipment(EquipmentEntity equipmentEntity) {
		equipmentEntity.setId(0);
		equipmentDAO.persist(equipmentEntity);
		return CommonUtils.addFilterHeader(Response.accepted(equipmentEntity)).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(EquipmentEntity equipmentEntity) {
		equipmentDAO.merge(equipmentEntity);
		return CommonUtils.responseFilterOk(Response.accepted(equipmentEntity));
	}




	@GET
	@Path("/types")
	public Response getEquipmentTypes() {
//        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();


		DBUtils.getEntityManager().createNamedQuery("EquipmentTypeEntity.getAllEquipmentType").getResultList();
		List<EquipmentTypeEntity> result = equipmentTypeDAO.getAll("EquipmentTypeEntity.getAllEquipmentType");
		return CommonUtils.responseFilterOk(result);
	}
//
//	@GET
//	@Path("/types/{id : \\d+}/infos")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response getEquipmentTypeInfos(@PathParam("id") int id) {
//
////        List<EquipmentTypeInfo> resultList = manager.createQuery("SELECT eti FROM EquipmentTypeInfo eti WHERE eti.equipmentTypeId = ? ORDER BY eti.weight", EquipmentTypeInfo.class).setParameter(1, id).getResultList();
//
//		return CommonUtils.responseFilterOk(resultList);
//	}
}
