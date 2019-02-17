package jaxrs.services;

import daos.AdditionalSpecsFieldDAO;
import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.EquipmentTypeDAO;
import dtos.responses.EquipmentResponse;
import dtos.wrappers.LocationWrapper;
import dtos.responses.MessageResponse;
import entities.*;
import utils.CommonUtils;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentService {

	private static final EquipmentDAO equipmentDAO = new EquipmentDAO();
	private static final EquipmentTypeDAO equipmentTypeDAO = new EquipmentTypeDAO();
	private static final ContractorDAO contractorDAO = new ContractorDAO();
	private static final AdditionalSpecsFieldDAO additionalSpecsFieldDAO = new AdditionalSpecsFieldDAO();


	/*========Constants============*/
//	Nghia's house address
	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "1000";

	private static final String REGEX_ORDERBY = "(\\w+\\.(asc|desc)($|,))+";

	@GET
	public Response searchEquipment(
			@QueryParam("lat") @DefaultValue(DEFAULT_LAT) double latitude,
			@QueryParam("long") @DefaultValue(DEFAULT_LONG) double longitude,
			@QueryParam("beginDate") @DefaultValue("") String beginDateStr,
			@QueryParam("endDate") @DefaultValue("") String endDateStr,
			@QueryParam("lquery") @DefaultValue("") String locationQuery,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		// TODO: 2/14/19 validate orderBy pattern
		if (!orderBy.matches(REGEX_ORDERBY)) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("orderBy param format must be " + REGEX_ORDERBY)).build();
		}

		Date beginDate = null;
		Date endDate = null;


		if (!beginDateStr.isEmpty() && !endDateStr.isEmpty()) {


			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-mm-dd");
			try {
				beginDate = simpleDateFormat.parse(beginDateStr);
				endDate = simpleDateFormat.parse(endDateStr);

			} catch (ParseException e) {
				e.printStackTrace();

				// TODO: 2/12/19 always return somethings even when format is shit for risk preventing

				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Date format must be yyyy-mm-dd")).build();
			}
			if (beginDate.after(endDate)) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("Error: beginDate > endDate")).build();

			}
		}


		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(
				beginDate, endDate,
				orderBy,
				offset,
				limit);
//		List<EquipmentEntity> equipmentEntities = equipmentDAO.getAll("EquipmentEntity.getAll");

		List<EquipmentResponse> result = new ArrayList<EquipmentResponse>();

		for (EquipmentEntity equipmentEntity : equipmentEntities) {
			EquipmentResponse equipmentResponse = new EquipmentResponse(equipmentEntity
					, new LocationWrapper(locationQuery, longitude, latitude)
			);
			result.add(equipmentResponse);
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return Response.ok(EquipmentDAO.getInstance().findByID(id)).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(@PathParam("id") long id, EquipmentEntity equipmentEntity) {


		if (equipmentEntity == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("no equipment information"));
		}
		equipmentEntity.setId(id);
		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			return CommonUtils.responseFilterBadRequest(new MessageResponse("Not found equipment with id=" + id));
		}

		if (equipmentEntity.getLatitude() == null) {
			equipmentEntity.setLatitude(Double.parseDouble(DEFAULT_LAT));
		}

		if (equipmentEntity.getLongitude() == null) {
			equipmentEntity.setLongitude(Double.parseDouble(DEFAULT_LONG));
		}


		//check for constructor id
		if (equipmentEntity.getContractor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor is null"));
			return responseBuilder.build();

		}
		long constructorId = equipmentEntity.getContractor().getId();

		ContractorEntity foundConstructor = contractorDAO.findByID(constructorId);
		if (foundConstructor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor not found"));
			return responseBuilder.build();
		}

		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType is null"));
			return responseBuilder.build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType not found"));
			return responseBuilder.build();
		}

		//todo validate for additionalSpecsValues
		for (AdditionalSpecsValueEntity additionalSpecsValueEntity : equipmentEntity.getAdditionalSpecsValues()) {
			AdditionalSpecsFieldEntity foundAdditionalSpecsFieldEntity = additionalSpecsFieldDAO.findByID(additionalSpecsValueEntity.getAdditionalSpecsField().getId());
			if (foundAdditionalSpecsFieldEntity == null) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("AdditionalSpecsField id=%d not found", additionalSpecsValueEntity.getAdditionalSpecsField().getId()))).build();
			}

			//remove id for persist transaction
			additionalSpecsValueEntity.setId(0);

			//validate datatype
			switch (foundAdditionalSpecsFieldEntity.getDataType()) {
				case STRING:
					break;
				case DOUBLE:
					try {
						Double.parseDouble(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}

					break;
				case INTEGER:
					try {
						Integer.parseInt(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}
					break;
			}
		}

		//delete status
		equipmentEntity.setStatus(null);

		//delete all children of the old equipment
		foundEquipment.deleteAllAvailableTimeRange();
		// validate time range begin end correct
		if (!equipmentDAO.validateBeginEndDate(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("beginDate > endDate !!!"));
			return responseBuilder.build();
		}

		// validate time range not intersect !!!
		if (!equipmentDAO.validateNoIntersect(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRanges must not be intersect !!!"));
			return responseBuilder.build();
		}
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


		//remove status
		equipmentEntity.setStatus(null);

		if (equipmentEntity.getLatitude() == null) {
			equipmentEntity.setLatitude(Double.parseDouble(DEFAULT_LAT));
		}

		if (equipmentEntity.getLongitude() == null) {
			equipmentEntity.setLongitude(Double.parseDouble(DEFAULT_LONG));
		}


		//check for constructor id
		if (equipmentEntity.getContractor() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor is null"));
			return responseBuilder.build();

		}
		long constructorId = equipmentEntity.getContractor().getId();

		ContractorEntity foundConstructor = contractorDAO.findByID(constructorId);
		if (foundConstructor == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("constructor not found"));
			return responseBuilder.build();
		}

		//check for equipment type

		if (equipmentEntity.getEquipmentType() == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType is null"));
			return responseBuilder.build();

		}
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();

		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByID(equipmentTypeId);
		if (foundEquipmentType == null) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("equipmentType not found"));
			return responseBuilder.build();
		}

		//todo validate for additionalSpecsValues
		for (AdditionalSpecsValueEntity additionalSpecsValueEntity : equipmentEntity.getAdditionalSpecsValues()) {
			AdditionalSpecsFieldEntity foundAdditionalSpecsFieldEntity = additionalSpecsFieldDAO.findByID(additionalSpecsValueEntity.getAdditionalSpecsField().getId());
			if (foundAdditionalSpecsFieldEntity == null) {
				return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse(String.format("AdditionalSpecsField id=%d not found", additionalSpecsValueEntity.getAdditionalSpecsField().getId()))).build();
			}

			//remove id for persist transaction
			additionalSpecsValueEntity.setId(0);

			//validate datatype
			switch (foundAdditionalSpecsFieldEntity.getDataType()) {
				case STRING:
					break;
				case DOUBLE:
					try {
						Double.parseDouble(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}

					break;
				case INTEGER:
					try {
						Integer.parseInt(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						return Response.status(Response.Status.BAD_REQUEST)
								.entity(new MessageResponse(
										String.format("AdditionalSpecsField value=%s is not %s"
												, additionalSpecsValueEntity.getValue()
												, foundAdditionalSpecsFieldEntity.getDataType())
								)).build();
					}
					break;
			}
		}

		//validate time range begin end correct
		if (!equipmentDAO.validateBeginEndDate(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRange: beginDate must <= endDate !!!"));
			return responseBuilder.build();
		}

		//validate time range not intersect !!!
		if (!equipmentDAO.validateNoIntersect(equipmentEntity.getAvailableTimeRanges())) {
			Response.ResponseBuilder responseBuilder = Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("TimeRanges must not be intersect !!!"));
			return responseBuilder.build();
		}

		equipmentEntity.setContractor(foundConstructor);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		equipmentDAO.persist(equipmentEntity);
		Response.ResponseBuilder builder = Response.status(Response.Status.CREATED).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		);
		return builder.build();


	}


//
//	@GET
//	@Path("/types")
//	public Response getEquipmentTypes() {
////        List<EquipmentType> resultList = manager.createQuery("SELECT et FROM EquipmentType et WHERE et.isActive = 1", EquipmentType.class).getResultList();
//
//
//		DBUtils.getEntityManager().createNamedQuery("EquipmentTypeEntity.getAllEquipmentType").getResultList();
//		List<EquipmentTypeEntity> result = equipmentTypeDAO.getAll("EquipmentTypeEntity.getAllEquipmentType");
//		return CommonUtils.responseFilterOk(result);
//	}


	@PUT
	@Path("{id:\\d+}/status")
	public Response updateEquipmentStatus(@PathParam("id") long id, EquipmentEntity entity) {

		EquipmentEntity foundEquipment = equipmentDAO.findByID(id);
		if (foundEquipment == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(new MessageResponse("id not found!")).build();
		}
		EquipmentEntity.Status status = entity.getStatus();
		switch (status) {
			case AVAILABLE:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.WAITING_FOR_RETURNING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse("Invalid! Current status is " + foundEquipment.getStatus()))
							.build();
				}
				break;
			case WAITING_FOR_DELIVERY:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.AVAILABLE) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse("Invalid! Current status is " + foundEquipment.getStatus()))
							.build();
				}
				break;
			case DELIVERING:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.WAITING_FOR_DELIVERY) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse("Invalid! Current status is " + foundEquipment.getStatus()))
							.build();
				}
				break;
			case RENTING:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.DELIVERING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse("Invalid! Current status is " + foundEquipment.getStatus()))
							.build();
				}
				break;
			case WAITING_FOR_RETURNING:
				// TODO: 2/1/19 change this status by system not user
				if (foundEquipment.getStatus() != EquipmentEntity.Status.RENTING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse("Invalid! Current status is " + foundEquipment.getStatus()))
							.build();
				}
				break;

		}

		foundEquipment.setStatus(entity.getStatus());
		equipmentDAO.merge(foundEquipment);
		return Response.ok(equipmentDAO.findByID(id)).build();

	}


}
