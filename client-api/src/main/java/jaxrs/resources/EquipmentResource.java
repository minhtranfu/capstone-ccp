package jaxrs.resources;

import daos.*;
import dtos.notifications.NotificationDTO;
import dtos.requests.EquipmentPostRequest;
import dtos.requests.EquipmentPutRequest;
import dtos.responses.EquipmentResponse;
import dtos.validationObjects.LocationValidator;
import dtos.wrappers.LocalDateWrapper;
import dtos.wrappers.LocationWrapper;
import dtos.responses.MessageResponse;
import entities.*;
import managers.FirebaseMessagingManager;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.Resource;
import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Valid;
import javax.validation.Validator;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.time.LocalDate;
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
	EquipmentImageDAO equipmentImageDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	EquipmentImageSubResource equipmentImageSubResource;


	@Resource
	Validator validator;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	@Context
	HttpHeaders httpHeaders;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimId;

	private long getClaimContractorId() {
		return claimId.getValue().longValue();
	}


	/*========Constants============*/
//	Nghia's house address
	private static final String DEFAULT_LAT = "10.806488";
	private static final String DEFAULT_LONG = "106.676364";
	private static final String DEFAULT_RESULT_LIMIT = "100";


	private void validateBeginEndDate(List<AvailableTimeRangeEntity> availableTimeRangeEntities) {
		for (AvailableTimeRangeEntity availableTimeRangeEntity : availableTimeRangeEntities) {
			if (availableTimeRangeEntity.getBeginDate().isAfter(availableTimeRangeEntity.getEndDate())) {
				throw new BadRequestException("TimeRange: beginDate must <= endDate !!!");
			}
		}
	}


	@GET
	public Response searchEquipment(

			@QueryParam("q") @DefaultValue("") String query,
			@QueryParam("lat") @DefaultValue(DEFAULT_LAT) double latitude,
			@QueryParam("long") @DefaultValue(DEFAULT_LONG) double longitude,
			@QueryParam("beginDate") @DefaultValue("") LocalDateWrapper beginDateWrapper,
			@QueryParam("endDate") @DefaultValue("") LocalDateWrapper endDateWrapper,
			@QueryParam("equipmentTypeId") @DefaultValue("0") long equipmentTypeId,
			@QueryParam("lquery") @DefaultValue("") String locationQuery,
			@QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("limit") @DefaultValue(DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset) {

		//2/14/19 validate orderBy pattern
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}
		LocalDate beginDate = beginDateWrapper.getLocalDate();
		LocalDate endDate = endDateWrapper.getLocalDate();

		if (endDate == null) {
			endDate = beginDate;
		}

		System.out.println(String.format("search: beginDate=%s, endDate=%s", beginDate, endDate));

		if (beginDate != null && endDate != null && beginDate.isAfter(endDate)) {
			throw new BadRequestException("Error: beginDate > endDate");

		}

		Long contractorId;
		String authorizationHeader = httpHeaders.getHeaderString(HttpHeaders.AUTHORIZATION);
		if (authorizationHeader != null) {
			contractorId = getClaimContractorId();
		} else {
			contractorId = null;
		}

		List<EquipmentEntity> equipmentEntities = equipmentDAO.searchEquipment(
				query,
				beginDate, endDate,
				contractorId,
				equipmentTypeId,
				orderBy,
				offset,
				limit);
//		List<EquipmentEntity> equipmentEntities = equipmentDAO.getByNamedQuery("EquipmentEntity.getByNamedQuery");

		List<EquipmentResponse> result = new ArrayList<EquipmentResponse>();

		for (EquipmentEntity equipmentEntity : equipmentEntities) {
			EquipmentResponse equipmentResponse = new EquipmentResponse(equipmentEntity
					, new LocationWrapper(locationQuery, latitude, longitude)
			);
			result.add(equipmentResponse);
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getEquipment(@PathParam("id") long id) {
		return Response.ok(equipmentDAO.findByIdWithValidation(id)).build();
	}


	@GET
	@Path("supplier")
	@RolesAllowed("contractor")
	public Response getEquipmentsBySupplierId(
			@QueryParam("status") EquipmentEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		long supplierId = getClaimContractorId();
		return Response.ok(equipmentDAO.getEquipmentsBySupplierId(supplierId, status, limit, offset, orderBy)).build();
	}

	@POST
//	@RolesAllowed({"USER"})
	@RolesAllowed("contractor")
	public Response postEquipment(@NotNull @Valid EquipmentPostRequest equipmentRequest) {


		EquipmentEntity equipmentEntity = modelConverter.toEntity(equipmentRequest);

		//get contractor from token
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(claimId.getValue().longValue());
		equipmentEntity.setContractor(foundContractor);


		validatePostPutEquipment(equipmentEntity);
		//  2/19/19 add available time ranges
		for (AvailableTimeRangeEntity availableTimeRange : equipmentEntity.getAvailableTimeRanges()) {
			availableTimeRange.setEquipment(equipmentEntity);
		}
		//  2/19/19 add addtionalsepecs
		for (AdditionalSpecsValueEntity additionalSpecsValue : equipmentEntity.getAdditionalSpecsValues()) {
			additionalSpecsValue.setEquipment(equipmentEntity);
		}

		equipmentDAO.persist(equipmentEntity);

		for (EquipmentImageEntity equipmentImage : equipmentEntity.getEquipmentImages()) {
			EquipmentImageEntity managedImage = equipmentImageDAO.findByIdWithValidation(equipmentImage.getId());
			managedImage.setEquipment(equipmentEntity);
			equipmentImageDAO.merge(managedImage);
		}

		return Response.status(Response.Status.CREATED).entity(
				equipmentDAO.findByID(equipmentEntity.getId())
		).build();

	}

	private void validatePostPutEquipment(EquipmentEntity equipmentEntity) {
		//check for constructor id
		long contractorId = equipmentEntity.getContractor().getId();
		ContractorEntity foundContractor = contractorDAO.findByIdWithValidation(contractorId);

		//set found entity to use addtional property more than just ID !
		equipmentEntity.setContractor(foundContractor);

		//validate contractor activated
		contractorDAO.validateContractorActivated(foundContractor);

		//check for equipment type null
		long equipmentTypeId = equipmentEntity.getEquipmentType().getId();


		// TODO: 3/9/19 validate thumbnail image is one of the equipment's images
		EquipmentImageEntity foundThumbnail = equipmentImageDAO.findByIdWithValidation(equipmentEntity.getThumbnailImage().getId());

		equipmentEntity.getEquipmentImages().stream()
				.filter(equipmentImageEntity -> equipmentImageEntity.getId() == foundThumbnail.getId())
				.findAny().orElseThrow(() -> new BadRequestException(String.format(
				"thumbnail id=%d not included in image list", foundThumbnail.getId())));


		//validate equipment tye
		EquipmentTypeEntity foundEquipmentType = equipmentTypeDAO.findByIdWithValidation(equipmentTypeId);
		equipmentEntity.setEquipmentType(foundEquipmentType);

		//check construction
		if (equipmentEntity.getConstruction() != null && equipmentEntity.getConstruction().getId() != 0) {

			long constructionId = equipmentEntity.getConstruction().getId();
			ConstructionEntity foundConstructionEntity = constructionDAO.findByIdWithValidation(constructionId);
			if (foundConstructionEntity.getContractor().getId() != equipmentEntity.getContractor().getId()) {
				throw new BadRequestException(String.format("construction id=%d not belongs to contractor id=%d"
						, constructionId
						, foundContractor.getId()));
			}

//			equipmentEntity.setConstruction(foundConstructionEntity);
//			// TODO: 3/5/19 take address from construction
//			//not so necessary but for future bug in construction delete
//			equipmentEntity.setAddress(foundConstructionEntity.getAddress());
//			equipmentEntity.setLatitude(foundConstructionEntity.getLatitude());
//			equipmentEntity.setLongitude(foundConstructionEntity.getLongitude());

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
	@RolesAllowed("contractor")
	public Response updateEquipmentById(@PathParam("id") long id, @NotNull @Valid EquipmentPutRequest equipmentPutRequest) {


		// TODO: 3/5/19 delete all necessary list

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(id);

		//already deleted with orphanRemoval
//		foundEquipment.deleteAllAvailableTimeRange();
//		foundEquipment.deleteAllEquipmentImage();


		//we dont update image information with put equipment anymore

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


		//delete all children of the old equipment
//		foundEquipment.deleteAllAvailableTimeRange();


		return Response.status(Response.Status.OK).entity(
				equipmentDAO.merge(foundEquipment)).build();
	}


	@PUT
	@Path("{id:\\d+}/status")
	@RolesAllowed("contractor")
	public Response updateEquipmentStatus(@PathParam("id") long id, EquipmentEntity entity) {

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(id);
		HiringTransactionEntity processingHiringTransaction = foundEquipment.getProcessingHiringTransactions().get(0);
		ContractorEntity requester = processingHiringTransaction.getRequester();
		long requesterId = requester.getId();


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
				// TODO: 3/12/19 validate only supplier can change this
				// TODO: 3/12/19 validate status must be Processing
				if (foundEquipment.getProcessingHiringTransactions().isEmpty() ||
						foundEquipment.getProcessingHiringTransactions().get(0).getStatus() != HiringTransactionEntity.Status.PROCESSING) {
					throw new BadRequestException("Transaction status must be PROCESSING");
				}

				if (getClaimContractorId() != requesterId) {
					throw new BadRequestException("Only requester can change this status!");
				}
				if (foundEquipment.getStatus() != EquipmentEntity.Status.DELIVERING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;
			case WAITING_FOR_RETURNING:
				// TODO: 3/12/19 validate status must be Processing
				if (foundEquipment.getProcessingHiringTransactions().isEmpty() ||
						foundEquipment.getProcessingHiringTransactions().get(0).getStatus() != HiringTransactionEntity.Status.PROCESSING) {
					throw new BadRequestException("Transaction status must be PROCESSING");
				}
				//  3/12/19 validate only requestser can change this
				if (requesterId != getClaimContractorId()) {
					throw new BadRequestException("Only requester can change this status manually");
				}

				if (foundEquipment.getStatus() != EquipmentEntity.Status.RENTING) {
					return Response.status(Response.Status.BAD_REQUEST).entity
							(new MessageResponse(String.format("Invalid! Cannot change status from %s to %s ", foundEquipment.getStatus(), status)))
							.build();
				}
				break;

		}

		foundEquipment.setStatus(entity.getStatus());

		foundEquipment = equipmentDAO.merge(foundEquipment);
		sendNotificationsForStatusChanged(foundEquipment, processingHiringTransaction);
		return Response.ok(foundEquipment).build();

	}

	private void sendNotificationsForStatusChanged(EquipmentEntity managedEquipment, HiringTransactionEntity hiringTransaction) {
		ContractorEntity requester = hiringTransaction.getRequester();

		ContractorEntity supplier = managedEquipment.getContractor();
		EquipmentEntity.Status status = managedEquipment.getStatus();
		switch (status) {
			case AVAILABLE:
				//notify nothing
				break;

			case DELIVERING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Equipment Delivering!",
						String.format("equipment \"%s\" is delivering to you by %s", managedEquipment.getName(), supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTIONS, hiringTransaction.getId())));

				break;
			case RENTING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Equipment Receiving confirmed",
						String.format("%s confirmed having received your equipment \"%s\"", requester.getName(), managedEquipment.getName())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTIONS, hiringTransaction.getId())));

				break;

			case WAITING_FOR_RETURNING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Renting transaction ended",
						String.format("%s has finished renting transaction early and want to return the equipment \"%s\"", requester.getName(), managedEquipment.getName())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTIONS, hiringTransaction.getId())));

				break;
		}

	}


	@Path("{id:\\d+}/images")
	public EquipmentImageSubResource toEquipmentImageResource(@PathParam("id") long equipmentId) {

		EquipmentEntity foundEquipment = equipmentDAO.findByIdWithValidation(equipmentId);

		equipmentImageSubResource.setEquipmentEntity(foundEquipment);

		return equipmentImageSubResource;
	}


}
