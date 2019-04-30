package jaxrs.resources;

import daos.MaterialFeedbackDAO;
import daos.MaterialTransactionDetailDAO;
import dtos.requests.MaterialFeedbackRequest;
import entities.MaterialFeedbackEntity;
import entities.MaterialTransactionDetailEntity;
import entities.MaterialTransactionEntity;
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

@Path("materialFeedbacks")
public class MaterialFeedbackResource {
	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	@Inject
	MaterialTransactionDetailDAO materialTransactionDetailDAO;

	@Inject
	MaterialFeedbackDAO materialFeedbackDAO;
	@Inject
	ModelConverter modelConverter;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	@POST
	@RolesAllowed("contractor")
	public Response requestFeedback(@Valid MaterialFeedbackRequest materialFeedbackRequest) {


		MaterialFeedbackEntity materialFeedbackEntity = modelConverter.toEntity(materialFeedbackRequest);

		// TODO: 3/21/19 validate transction status must be FINISHED or CANCELED

		MaterialTransactionDetailEntity managedTransaction = materialTransactionDetailDAO.findByIdWithValidation
				(materialFeedbackEntity.getMaterialTransactionDetail().getId());
		if (managedTransaction.getMaterialTransaction().getStatus() != MaterialTransactionEntity.Status.FINISHED) {
			throw new BadRequestException("You can only feedback on FINISHED status");
		}

		if (managedTransaction.getMaterialTransaction().getRequester().getId() != getClaimContractorId()) {
			throw new BadRequestException("Only requester can make feedback");
		}

		materialFeedbackDAO.persist(materialFeedbackEntity);
		return Response.status(Response.Status.CREATED).entity(
				materialFeedbackDAO.findByID(materialFeedbackEntity.getId())
		).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getFeedback(@PathParam("id") long id) {

		MaterialFeedbackEntity foundFeedback = materialFeedbackDAO.findByIdWithValidation(id);
		return Response.ok(foundFeedback).build();
	}

	@GET
	public Response getFeedbacksBySupplier(
			@QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit,
			@QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy
			,
			@QueryParam("supplierId") Long supplierIdParam
	) {
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
		return Response.ok(materialFeedbackDAO.getFeedbacksBySupplier(supplierId,limit,offset,orderBy)).build();
	}
}
