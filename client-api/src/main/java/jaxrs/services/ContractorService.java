package jaxrs.services;

import daos.ContractorDAO;
import entities.ContractorEntity;
import utils.CommonUtils;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("contractors")
public class ContractorService {

	private static final ContractorDAO CONTRACTOR_DAO = new ContractorDAO();

	@GET
	@Path("{id}")
	public Response getContractorById(@PathParam("id") long id) {
		ContractorEntity contractor = CONTRACTOR_DAO.findByID(id);
		return CommonUtils.responseFilterOk(contractor);
	}


	
}
