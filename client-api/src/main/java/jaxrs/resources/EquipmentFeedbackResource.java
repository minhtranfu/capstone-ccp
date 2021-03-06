package jaxrs.resources;

import daos.EquipmentFeedbackDAO;
import daos.HiringTransactionDAO;
import dtos.requests.EquipmentFeedbackRequest;
import entities.EquipmentFeedbackEntity;
import entities.HiringTransactionEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.Response;

@Path("equipmentFeedbacks")
public class EquipmentFeedbackResource {
	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	EquipmentFeedbackDAO equipmentFeedbackDAO;
	@Inject
	ModelConverter modelConverter;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@POST
	@RolesAllowed("contractor")
	public Response requestFeedback(@Valid EquipmentFeedbackRequest equipmentFeedbackRequest) {


		EquipmentFeedbackEntity equipmentFeedbackEntity = modelConverter.toEntity(equipmentFeedbackRequest);

		// TODO: 3/21/19 validate transction status must be FINISHED or CANCELED

		HiringTransactionEntity managedTransaction = hiringTransactionDAO.findByIdWithValidation
				(equipmentFeedbackEntity.getHiringTransaction().getId());
		if (managedTransaction.getStatus() != HiringTransactionEntity.Status.FINISHED) {
			throw new BadRequestException("You can only feedback on FINISHED  status");
		}

		if (managedTransaction.getRequester().getId() != getClaimContractorId()) {
			throw new BadRequestException("Only requester can make feedback");
		}

		equipmentFeedbackDAO.persist(equipmentFeedbackEntity);
		return Response.status(Response.Status.CREATED).entity(
				equipmentFeedbackDAO.findByID(equipmentFeedbackEntity.getId())
		).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getFeedback(@PathParam("id") long id) {

		EquipmentFeedbackEntity foundFeedback = equipmentFeedbackDAO.findByIdWithValidation(id);
		return Response.ok(foundFeedback).build();
	}

	@GET
	public Response getFeedbacksBySupplier(
			@QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy,
			@QueryParam("supplierId") Long supplierIdParam) {
		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		long supplierId;
		if (supplierIdParam != null) {
			supplierId = supplierIdParam;

		} else {
			supplierId = getClaimContractorId();
		}
		//no need to validate contractor because it will return empty list
		return Response.ok(equipmentFeedbackDAO.getFeedbacksBySupplier(supplierId
				, limit, offset, orderBy)).build();
	}
}
