package jaxrs.services;

import daos.ConstructorDAO;
import daos.EquipmentDAO;
import daos.EquipmentTypeDAO;
import dtos.MessageDTO;
import entities.AdditionalSpecsFieldEntity;
import entities.ConstructorEntity;
import entities.EquipmentEntity;
import entities.EquipmentTypeEntity;
import utils.CommonUtils;
import utils.DBUtils;

import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.List;

@Path("/equipments")
public class EquipmentService {
    private static EntityManager manager = DBUtils.getEntityManager();

    @GET
    @Path("/types")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEquipmentTypes() {
        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();
        return CommonUtils.responseFilter(resultList);
    }

    @GET
    @Path("/types/{id : \\d+}/infos")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getEquipmentTypeInfos(@PathParam("id") int id) {

	@GET
	@Path("{id:\\d+}")
	public EquipmentEntity getEquipment(@PathParam("id") long id) {
		return EquipmentDAO.getInstance().findByID(id);
	}


	@POST
	@Consumes(MediaType.APPLICATION_JSON)
	public Response postEquipment(EquipmentEntity equipmentEntity) {
		//remove id
		equipmentEntity.setId(0);


		//check for constructor id
		if (equipmentEntity.getConstructor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("constructor is null"));
			return responseBuilder.build();

		}
		long constructorId = equipmentEntity.getConstructor().getId();

		ConstructorEntity foundConstructor = constructorDAO.findByID(constructorId);
		if (foundConstructor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("constructor not found"));
			return responseBuilder.build();
		}


		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("equipment_type is null"));
			return responseBuilder.build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageDTO("equipment_type not found"));
			return responseBuilder.build();
		}


		equipmentEntity.setConstructor(foundConstructor);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		equipmentDAO.persist(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.CREATED).entity(equipmentEntity);
		return builder.build();

	}

//	@PUT
//	@Path("{id:\\d+}")
//	public Response updateEquipmentById(EquipmentEntity equipmentEntity) {
//		equipmentDAO.merge(equipmentEntity);
//		return CommonUtils.responseFilterOk(Response.accepted(equipmentEntity));
//	}


	@GET
	@Path("/types")
	public List<EquipmentTypeEntity> getEquipmentTypes() {
//		return "asdasdadsadasd";
//        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();


		DBUtils.getEntityManager().createNamedQuery("EquipmentTypeEntity.getAllEquipmentType").getResultList();
		List<EquipmentTypeEntity> result = equipmentTypeDAO.getAll("EquipmentTypeEntity.getAllEquipmentType");
		return result;
	}

	@GET
	@Path("/types/{id : \\d+}/specs")
	@Produces(MediaType.APPLICATION_JSON)
	public List<AdditionalSpecsFieldEntity> getEquipmentTypeSpecs(@PathParam("id") int id) {

        List<AdditionalSpecsFieldEntity> resultList = DBUtils.getEntityManager().createQuery("SELECT eti FROM AdditionalSpecsFieldEntity eti WHERE eti.equipmentTypeId = ?", AdditionalSpecsFieldEntity.class).setParameter(1, id).getResultList();

		return resultList;
	}
}
