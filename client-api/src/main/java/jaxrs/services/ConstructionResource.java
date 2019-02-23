package jaxrs.services;

import entities.ContractorEntity;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

public class ConstructionResource {
	private ContractorEntity contractorEntity;

	public ConstructionResource(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}

//	@GET
//	@Path("{id:\\d}")
//	public Response getConstructionById() {
//		return Response.ok().build();
//	}
}
