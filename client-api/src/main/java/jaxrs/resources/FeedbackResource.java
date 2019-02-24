package jaxrs.resources;

import daos.ContractorDAO;
import daos.FeedbackDAO;
import daos.FeedbackTypeDAO;
import dtos.responses.MessageResponse;
import entities.ContractorEntity;
import entities.FeedbackEntity;
import entities.FeedbackTypeEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("feedbacks")
@Produces(MediaType.APPLICATION_JSON)
public class FeedbackResource {

	public static final FeedbackDAO feedbackDao = new FeedbackDAO();
	public static final ContractorDAO contractorDao = new ContractorDAO();
	public static final FeedbackTypeDAO feedbackTypeDAO = new FeedbackTypeDAO();


	@GET
	public Response getFeedbacks(@QueryParam("from") @DefaultValue("0") long fromContractorId,
								 @QueryParam("to") @DefaultValue("0") long toContractorId) {

		EntityManager entityManager = DBUtils.getEntityManager();
		List<FeedbackEntity> result = new ArrayList<>();


		if (fromContractorId != 0) {

			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("FeedbackEntity.getBy", FeedbackEntity.class)
						.setParameter("toContractorId", toContractorId)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();

			} else {
				result = entityManager.createNamedQuery("FeedbackEntity.getByFromContractorId", FeedbackEntity.class)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();
			}
		} else {
			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("FeedbackEntity.getByToContractorId", FeedbackEntity.class)
						.setParameter("toContractorId", toContractorId)
						.getResultList();
			}
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getFeedback(@PathParam("id") long id) {
		FeedbackEntity foundFeedback = feedbackDao.findByID(id);
		if (foundFeedback == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("feedback id=%d not found", id))
			).build();
		}
		return Response.ok(foundFeedback).build();
	}


	@POST
	public Response postFeedback(FeedbackEntity feedbackEntity) {
		feedbackEntity.setId(0);

		// TODO: 2/21/19 check from contractor

		long fromContractorId = feedbackEntity.getFromContractor() != null
				? feedbackEntity.getFromContractor().getId()
				: 0;

		ContractorEntity foundContractor = contractorDao.findByID(fromContractorId);
		if (foundContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("contractor id = %s not found", fromContractorId))
			).build();
		}


		// TODO: 2/21/19 check to contractor

		long toContractorId = feedbackEntity.getFromContractor() != null
				? feedbackEntity.getToContractor().getId()
				: 0;

		ContractorEntity toContractor = contractorDao.findByID(toContractorId);
		if (toContractor == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("contractor id = %s not found", toContractorId))
			).build();
		}
		// TODO: 2/21/19 check feedback_type_id
		long feedbackTypeId = feedbackEntity.getFeedbackType() != null
				? feedbackEntity.getFeedbackType().getId()
				: 0;
		FeedbackTypeEntity foundFeedbackType = feedbackTypeDAO.findByID(feedbackTypeId);
		if (foundFeedbackType == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("feedbackTypeId = %s not found", feedbackTypeId))
			).build();
		}


		feedbackDao.persist(feedbackEntity);
		return Response.ok(feedbackDao.findByID(feedbackEntity.getId())).build();
	}


}
