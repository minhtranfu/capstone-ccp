package jaxrs.resources;

import daos.ContractorDAO;
import daos.ContractorVerifyingImageDAO;
import dtos.IdOnly;
import entities.ContractorEntity;
import entities.ContractorVerifyingImageEntity;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.servlet.ServletContext;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import java.util.List;

@Stateless
public class ContractorVerifyingImageResource {
	@Context
	ServletContext servletContext;
	@Inject
	ContractorVerifyingImageDAO contractorVerifyingImageDAO;

	@Inject
	ContractorDAO contractorDAO;


	private ContractorEntity contractorEntity;

	public ContractorVerifyingImageResource() {
	}

	public ContractorEntity getContractorEntity() {
		return contractorEntity;
	}

	public void setContractorEntity(ContractorEntity contractorEntity) {
		this.contractorEntity = contractorEntity;
	}

	private ContractorVerifyingImageEntity validateImage(long imageId) {
		ContractorVerifyingImageEntity foundImage = contractorVerifyingImageDAO.findByIdWithValidation(imageId);
		if (foundImage.getContractor() != null &&
				foundImage.getContractor().getId() != contractorEntity.getId()) {
			throw new BadRequestException(String.format("Contractor id=%d not contain ContractorVerifyingImage id=%d",
					contractorEntity.getId(), imageId));
		}

		return foundImage;
	}

	@GET
	@Path("{id:\\d+}")
	public Response getImageById(@PathParam("id") long imageId) {
		return Response.ok(validateImage(imageId)).build();
	}

	@GET
	public Response getImages() {
		return Response.ok(contractorEntity.getContractorVerifyingImages()).build();
	}

	@POST
	public Response addUploadedImageWithId(@NotNull List<@Valid IdOnly> contractorVerifyingImageRequests) {
		for (IdOnly contractorVerifyingImageRequest : contractorVerifyingImageRequests) {
			ContractorVerifyingImageEntity contractorVerifyingImageEntity = contractorVerifyingImageDAO.findByIdWithValidation(contractorVerifyingImageRequest.getId());
			// validate contractorVerifying image
			if (contractorVerifyingImageEntity.getContractor() != null
					&& contractorVerifyingImageEntity.getContractor().getId() != contractorEntity.getId()) {
				throw new BadRequestException(String.format("ContractorVerifyingImage id=%d is already belongs to ContractorVerifying id=%d",
						contractorVerifyingImageEntity.getId(),
						contractorVerifyingImageEntity.getContractor().getId()));
			}

			contractorEntity.addContractorVerifyingImage(contractorVerifyingImageEntity);
		}

		return Response.status(Response.Status.CREATED).entity(contractorDAO.merge(contractorEntity).getContractorVerifyingImages()).build();
	}

	//cannot Delete image

}
