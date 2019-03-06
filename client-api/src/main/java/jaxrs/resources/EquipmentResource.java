package jaxrs.resources;

import daos.*;
import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentPutRequest;
import dtos.requests.EquipmentRequest;
import dtos.responses.EquipmentResponse;
import dtos.validationObjects.LocationValidator;
import dtos.wrappers.LocationWrapper;
import dtos.responses.MessageResponse;
import entities.*;
import utils.CommonUtils;
import utils.ModelConverter;

import javax.annotation.Resource;
import javax.annotation.security.RolesAllowed;
import javax.ejb.Local;
import javax.inject.Inject;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import javax.validation.Validator;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Path("/equipments")
@Produces(MediaType.APPLICATION_JSON)
public class EquipmentResource {

	@Inject
	EquipmentDAO equipmentDAO;
	@Inject
	EquipmentTypeDAO equipmentTypeDAO;

	@Inject
	ContractorDAO contractorDAO;
	@Inject
	ConstructionDAO constructionDAO;

	@Inject
	AdditionalSpecsFieldDAO additionalSpecsFieldDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	DescriptionImageResource descriptionImageResource;

	@Resource
	Validator validator;


	/*========Constants============*/
//	Nghia's house address
	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "1000";

	private static final String REGEX_ORDERBY = "(\\w+\\.(asc|desc)($|,))+";


	private void validateBeginEndDate(List<AvailableTimeRangeEntity> availableTimeRangeEntities) {
		for (AvailableTimeRangeEntity availableTimeRangeEntity : availableTimeRangeEntities) {
			if (availableTimeRangeEntity.getBeginDate().isAfter(availableTimeRangeEntity.getEndDate())) {
				throw new BadRequestException("TimeRange: beginDate must <= endDate !!!");
			}
		}
	}


	@GET
	public Response searchEquipment(
			@QueryParam("lat") @DefaultValue(DEFAULT_LAT) double latitude,
			@QueryParam("long") @DefaultValue(DEFAULT_LONG) double longitude,
			@QueryParam("beginDate") @DefaultValue("") String beginDateStr,
			@QueryParam("endDate") @DefaultValue("") String endDateStr,
			@QueryParam("equipmentTypeId") @DefaultValue("0") long equipmentTypeId,
			@QueryParam("lquery") @DefaultValue("") String locationQuery,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		// TODO: 2/14/19 validate orderBy pattern
		if (!orderBy.matches(REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + REGEX_ORDERBY);
		}

		LocalDate beginDate = null;
		LocalDate endDate = null;
		DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

		if (!beginDateStr.isEmpty() && !endDateStr.isEmpty()) {


//			SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-mm-dd");
			try {
				beginDate = LocalDate.parse(beginDateStr, dateTimeFormatter);
				endDate = LocalDate.parse(endDateStr, dateTimeFormatter);

			} catch (DateTimeParseException e) {
				e.printStackTrace();

				// TODO: 2/12/19 always return somethings even when format is shit for risk preventing
				throw new BadRequestException("Date format must be yyyy-MM-dd");
			}
			if (beginDate.isAfter(endDate)) {
				throw new BadRequestException("Error: beginDate > endDate");

			}
		}


		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(
				beginDate, endDate,
				equipmentTypeId,
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
		return Response.ok(equipmentDAO.findByID(id)).build();
	}


	@POST
//	@RolesAllowed({"USER"})
	public Response postEquipment(@NotNull @Valid EquipmentPostRequest equipmentRequest) {
		//clean equipment entity

		EquipmentEntity equipmentEntity = modelConverter.toEntity(equipmentRequest);


		validatePostPutEquipment(equipmentEntity);
//  2/19/19 add available time ranges
		for (AvailableTimeRangeEntity availableTimeRange : equipmentEntity.getAvailableTimeRanges()) {
			availableTimeRange.setEquipment(equipmentEntity);
		}

		//  2/19/19 add addtionalsepecs
		for (AdditionalSpecsValueEntity additionalSpecsValue : equipmentEntity.getAdditionalSpecsValues()) {
			additionalSpecsValue.setEquipment(equipmentEntity);
		}

		// 3/5/19 add description images
		for (DescriptionImageEntity descriptionImage : equipmentEntity.getDescriptionImages()) {
			descriptionImage.setEquipment(equipmentEntity);
		}

		equipmentDAO.persist(equipmentEntity);
		return Response.status(Response.Status.CREATED).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		).build();

	}

	private void validatePostPutEquipment(EquipmentEntity equipmentEntity) {
		//check for constructor id null
		long contractorId = equipmentEntity.getContractor().getId();
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(contractorId);

		//set found entity to use addtional property more than just ID !
		equipmentEntity.setContractor(foundContractor);

		//check for equipment type null
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();


		//validate equipment tye
		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByIdWithValidation(equipmentTypeId);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		//check construction
		if (equipmentEntity.getConstruction() != null && equipmentEntity.getConstruction().getId()!=0) {

			long constructionId = equipmentEntity.getConstruction().getId();
			ConstructionEntity foundConstructionEntity = constructionDAO.findByIdWithValidation(constructionId);
			if (foundConstructionEntity.getContractor().getId() != equipmentEntity.getContractor().getId()) {
				throw new BadRequestException(String.format("construction id=%d not belongs to contractor id=%d"
						, constructionId
						, foundContractor.getId()));
			}

			equipmentEntity.setConstruction(foundConstructionEntity);
			// TODO: 3/5/19 take address from construction
			//not so necessary but for future bug in construction delete
			equipmentEntity.setAddress(foundConstructionEntity.getAddress());
			equipmentEntity.setLatitude(foundConstructionEntity.getLatitude());
			equipmentEntity.setLongitude(foundConstructionEntity.getLongitude());

		} else {
			//validate long lat address
			LocationValidator locationValidator = new LocationValidator(equipmentEntity.getAddress(), equipmentEntity.getLongitude(), equipmentEntity.getLatitude());
			Set<ConstraintViolation<LocationValidator>> validationResult = validator.validate(locationValidator);
			if (!validationResult.isEmpty()) {
				throw new ConstraintViolationException(validationResult);
			}

		}


		//todo validate for additionalSpecsValues
		for (AdditionalSpecsValueEntity additionalSpecsValueEntity : equipmentEntity.getAdditionalSpecsValues()) {
			//validate field id
			AdditionalSpecsFieldEntity foundAdditionalSpecsFieldEntity = additionalSpecsFieldDAO.findByIdWithValidation(
					additionalSpecsValueEntity.getAdditionalSpecsField().getId());
			additionalSpecsValueEntity.setAdditionalSpecsField(foundAdditionalSpecsFieldEntity);

			// TODO: 3/5/19 validate field belongs to equipment types
			if (
					foundAdditionalSpecsFieldEntity.getEquipmentType().getId() !=
							foundEquipmentType.getId()) {
				throw new BadRequestException(String.format("AdditionalSpecsField id=%d not belongs to EquipmentType id=%d",
						foundAdditionalSpecsFieldEntity.getId()
						, foundEquipmentType.getId()));
			}


			//validate datatype
			switch (foundAdditionalSpecsFieldEntity.getDataType()) {
				case STRING:
					break;
				case DOUBLE:
					try {
						Double.parseDouble(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						throw new BadRequestException(String.format("AdditionalSpecsField value=%s is not %s"
								, additionalSpecsValueEntity.getValue()
								, foundAdditionalSpecsFieldEntity.getDataType())
						);
					}

					break;
				case INTEGER:
					try {
						Integer.parseInt(additionalSpecsValueEntity.getValue());
					} catch (NumberFormatException e) {
						throw new BadRequestException(String.format("AdditionalSpecsField value=%s is not %s"
								, additionalSpecsValueEntity.getValue()
								, foundAdditionalSpecsFieldEntity.getDataType())
						);
					}
					break;
			}
		}

		//validate time range begin end correct
		validateBeginEndDate(equipmentEntity.getAvailableTimeRanges());

		//validate time range not intersect !!!
		if (!equipmentDAO.validateNoIntersect(equipmentEntity.getAvailableTimeRanges())) {
			throw new BadRequestException("TimeRanges must not be intersect !!!");
		}
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateEquipmentById(@PathParam("id") long id, @NotNull @Valid EquipmentPutRequest equipmentPutRequest) {


		// TODO: 3/5/19 delete all necessary list

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(id);

		//already deleted with orphanRemoval
//		foundEquipment.deleteAllAvailableTimeRange();
//		foundEquipment.deleteAllDescriptionImage();
		foundEquipment.getDescriptionImages().clear();
		foundEquipment.getAdditionalSpecsValues().clear();
		foundEquipment.getAvailableTimeRanges().clear();

		modelConverter.toEntity(equipmentPutRequest, foundEquipment);


		validatePostPutEquipment(foundEquipment);
		// todo validate available time range in dto
		for (AvailableTimeRangeEntity availableTimeRange : foundEquipment.getAvailableTimeRanges()) {
			availableTimeRange.setEquipment(foundEquipment);
		}

		//  todo validate additional specs in dto
		for (AdditionalSpecsValueEntity additionalSpecsValue : foundEquipment.getAdditionalSpecsValues()) {
			additionalSpecsValue.setEquipment(foundEquipment);
		}

		// todo vaildate description image in dto

		// TODO: 3/5/19 issue: what if client want to delete some image, and inserting new ones ?
		// TODO: 3/5/19 issuse: what if client just want to delete some image ?
		for (DescriptionImageEntity descriptionImage : foundEquipment.getDescriptionImages()) {
			descriptionImage.setEquipment(foundEquipment);
		}

		//delete all children of the old equipment
//		foundEquipment.deleteAllAvailableTimeRange();



		return Response.status(Response.Status.OK).entity(
				equipmentDAO.merge(foundEquipment)).build();
	}


	@PUT
	@Path("{id:\\d+}/status")
	public Response updateEquipmentStatus(@PathParam("id") long id, EquipmentEntity entity) {

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(id);

		EquipmentEntity.Status status = entity.getStatus();
		switch (status) {
			case AVAILABLE:
				//cant change to this status because already implemented in Finish Transaction
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse("Not allowed to change to " + status))
						.build();
			case DELIVERING:
				//cant change to this status because already implemented in Process Transaction
				return Response.status(Response.Status.BAD_REQUEST).entity
						(new MessageResponse("Not allowed to change to " + status))
						.build();
			case RENTING:
				if (foundEquipment.getStatus() != EquipmentEntity.Status.DELIVERING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;
			case WAITING_FOR_RETURNING:
				// TODO: 2/1/19 change this status by system not user
				if (foundEquipment.getStatus() != EquipmentEntity.Status.RENTING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;

		}

		foundEquipment.setStatus(entity.getStatus());
		equipmentDAO.merge(foundEquipment);
		return Response.ok(equipmentDAO.findByID(id)).build();

	}


	@Path("{id:\\d+}/images")
	public DescriptionImageResource toDescriptionImageResource(@PathParam("id") long equipmentId) {

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(equipmentId);

		descriptionImageResource.setEquipmentEntity(foundEquipment);

		return descriptionImageResource;
	}
}
