package jaxrs.resources;

import daos.ContractorDAO;
import daos.FeedbackDAO;
import daos.FeedbackTypeDAO;
import dtos.requests.FeedbackRequest;
import dtos.responses.MessageResponse;
import entities.ContractorEntity;
import entities.ReportEntity;
import entities.ReportTypeEntity;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("feedbacks")
@Produces(MediaType.APPLICATION_JSON)
@RolesAllowed("contractor")

public class FeedbackResource {

	//	public static final FeedbackDAO feedbackDao = new FeedbackDAO();

	@Inject
	public ContractorDAO contractorDao;


	@Inject
	public FeedbackTypeDAO feedbackTypeDAO;

	@Inject
	FeedbackDAO feedbackDao;

	@PersistenceContext
	EntityManager entityManager;

	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	@Inject
	ModelConverter modelConverter;


	@GET
	@Path("status")
	public String getStatus() {
		return "Good to go!";
	}
	@GET
	public Response getFeedbacks(@QueryParam("from") @DefaultValue("0") long fromContractorId,
								 @QueryParam("to") @DefaultValue("0") long toContractorId) {

		List<ReportEntity> result = new ArrayList<>();


		if (fromContractorId != 0) {

			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("FeedbackEntity.getBy", ReportEntity.class)
						.setParameter("toContractorId", toContractorId)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();

			} else {
				result = entityManager.createNamedQuery("FeedbackEntity.getByFromContractorId", ReportEntity.class)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();
			}
		} else {
			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("FeedbackEntity.getByToContractorId", ReportEntity.class)
						.setParameter("toContractorId", toContractorId)
						.getResultList();
			}
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getFeedback(@PathParam("id") long id) {
		ReportEntity foundFeedback = feedbackDao.findByID(id);
		if (foundFeedback == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("feedback id=%d not found", id))
			).build();
		}
		return Response.ok(foundFeedback).build();
	}


	@POST
	@RolesAllowed("contractor")
	public Response postFeedback(@Valid FeedbackRequest feedbackRequest) {


		ReportEntity reportEntity = modelConverter.toEntity(feedbackRequest);

		ContractorEntity fromContractor = contractorDao.findByIdWithValidation(claimContractorId.getValue().longValue());
		reportEntity.setFromContractor(fromContractor);


		ContractorEntity toContractor = contractorDao.findByIdWithValidation(reportEntity.getToContractor().getId());
		reportEntity.setToContractor(toContractor);


		ReportTypeEntity foundFeedbackType = feedbackTypeDAO.findByIdWithValidation(reportEntity.getReportType().getId());
		reportEntity.setReportType(foundFeedbackType);

		feedbackDao.persist(reportEntity);
		return Response.ok(feedbackDao.findByID(reportEntity.getId())).build();
	}


}
