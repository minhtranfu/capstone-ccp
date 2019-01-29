package jaxrs.services;

import daos.ConstructorDAO;
import entities.ContractorEntity;
import utils.CommonUtils;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response;

@Path("constructors")
public class ConstructorService {

	private static final ConstructorDAO constructorDAO = new ConstructorDAO();

	@GET
	@Path("{id}")
	public Response getConstructorById(@PathParam("id") long id) {
		ContractorEntity constructor = constructorDAO.findByID(id);
		return CommonUtils.responseFilterOk(constructor);
	}


	
}
