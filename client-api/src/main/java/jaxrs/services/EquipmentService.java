package jaxrs.services;

import daos.ConstructorDAO;
import daos.EquipmentDAO;
import daos.EquipmentTypeDAO;
import dtos.EquipmentResponse;
import dtos.LocationDTO;
import dtos.MessageResponse;
import entities.*;
import utils.CommonUtils;
import utils.DBUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentService {

	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();
	private static final ConstructorDAO constructorDAO = new ConstructorDAO();


	@GET
	public Response searchEquipment(
			@QueryParam("lat") double latitude,
			@QueryParam("long") double longitude,
			@QueryParam("begin_date") Date beginDate,
			@QueryParam("end_date") Date endDate,
			@QueryParam("lquery") @DefaultValue("") String locationQuery) {

		if (beginDate == null || endDate == null) {
			// return all
			List<EquipmentEntity> equipmentEntities = equipmentDAO.getAll("EquipmentEntity.getAll");
			return CommonUtils.responseFilterOk(equipmentEntities);

		}
		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(beginDate, endDate);
		List<EquipmentResponse> result = new ArrayList<EquipmentResponse>();

		for (EquipmentEntity equipmentEntity : equipmentEntities) {
			EquipmentResponse equipmentResponse = new EquipmentResponse(equipmentEntity
					, new LocationDTO(locationQuery, longitude, latitude)
			);
			result.add(equipmentResponse);
		}
		return CommonUtils.responseFilterOk(result);
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return Response.ok(EquipmentDAO.getInstance().findByID(id)).build();
	}
	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(@PathParam("id") long id,  EquipmentEntity equipmentEntity) {


		if (equipmentEntity == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("No id"));
		}
		equipmentEntity.setId(id);
		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("Not found equipment with id=" + id));
		}

		//delete all children of the old equipment
		foundEquipment.deleteAllAvailableTimeRange();
		equipmentDAO.merge(foundEquipment);
		//todo delete image
		//todo delete location
		//todo delete construction




		//add all children from new equipment
		equipmentDAO.merge(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.OK).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		);
		return CommonUtils.addFilterHeader(builder).build();
	}


	@POST
	public Response postEquipment(EquipmentEntity equipmentEntity) {
		//remove id
		equipmentEntity.setId(0);


		//check for constructor id
		if (equipmentEntity.getContractor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor is null"));
			return CommonUtils.addFilterHeader(responseBuilder).build();

		}
		long constructorId = equipmentEntity.getContractor().getId();

		ContractorEntity foundConstructor = constructorDAO.findByID(constructorId);
		if (foundConstructor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor not found"));
			return CommonUtils.addFilterHeader(responseBuilder).build();
		}


		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipment_type is null"));
			return CommonUtils.addFilterHeader(responseBuilder).build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipment_type not found"));
			return CommonUtils.addFilterHeader(responseBuilder).build();
		}


		equipmentEntity.setContractor(foundConstructor);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		equipmentDAO.persist(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.CREATED).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		);
		return CommonUtils.addFilterHeader(builder).build();


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
//	@Path("/types/{id : \\d+}/fields")
//	@Produces(MediaType.APPLICATION_JSON)
//	public Response getEquipmentTypeInfos(@PathParam("id") int id) {
//
//        List<AdditionalSpecsFieldEntity> resultList = DBUtils.getEntityManager().createQuery("SELECT eti FROM AdditionalSpecsFieldEntity eti WHERE eti.equipmentType = ?", AdditionalSpecsFieldEntity.class).setParameter(1, id).getResultList();
//
//		return CommonUtils.responseFilterOk(resultList);
//	}
}
