package jaxrs.resources;

import entities.ContractorEntity;

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
