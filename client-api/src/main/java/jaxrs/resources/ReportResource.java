package jaxrs.resources;

import daos.ContractorDAO;
import daos.ReportDAO;
import daos.ReportTypeDAO;
import dtos.requests.ReportRequest;
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

@Path("reports")
@Produces(MediaType.APPLICATION_JSON)
public class ReportResource {

	//	public static final ReportDAO reportDao = new ReportDAO();

	@Inject
	public ContractorDAO contractorDao;


	@Inject
	public ReportTypeDAO reportTypeDAO;

	@Inject
	ReportDAO reportDao;

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
	public Response getReports(@QueryParam("from") @DefaultValue("0") long fromContractorId,
								 @QueryParam("to") @DefaultValue("0") long toContractorId) {

		List<ReportEntity> result = new ArrayList<>();


		if (fromContractorId != 0) {

			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("ReportEntity.getBy", ReportEntity.class)
						.setParameter("toContractorId", toContractorId)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();

			} else {
				result = entityManager.createNamedQuery("ReportEntity.getByFromContractorId", ReportEntity.class)
						.setParameter("fromContractorId", fromContractorId)
						.getResultList();
			}
		} else {
			if (toContractorId != 0) {
				result = entityManager.createNamedQuery("ReportEntity.getByToContractorId", ReportEntity.class)
						.setParameter("toContractorId", toContractorId)
						.getResultList();
			}
		}
		return Response.ok(result).build();
	}

	@GET
	@Path("{id:\\d+}")
	public Response getReport(@PathParam("id") long id) {
		ReportEntity foundReport = reportDao.findByID(id);
		if (foundReport == null) {
			return Response.status(Response.Status.BAD_REQUEST).entity(
					new MessageResponse(String.format("report id=%d not found", id))
			).build();
		}
		return Response.ok(foundReport).build();
	}


	@POST
	@RolesAllowed("contractor")
	public Response postReport(@Valid ReportRequest reportRequest) {


		ReportEntity reportEntity = modelConverter.toEntity(reportRequest);

		ContractorEntity fromContractor = contractorDao.findByIdWithValidation(claimContractorId.getValue().longValue());
		reportEntity.setFromContractor(fromContractor);


		ContractorEntity toContractor = contractorDao.findByIdWithValidation(reportEntity.getToContractor().getId());
		reportEntity.setToContractor(toContractor);


		ReportTypeEntity foundReportType = reportTypeDAO.findByIdWithValidation(reportEntity.getReportType().getId());
		reportEntity.setReportType(foundReportType);

		reportDao.persist(reportEntity);
		return Response.ok(reportDao.findByID(reportEntity.getId())).build();
	}


}
