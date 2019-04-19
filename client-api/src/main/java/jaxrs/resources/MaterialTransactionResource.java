package jaxrs.resources;

import daos.ContractorDAO;
import daos.MaterialDAO;
import daos.MaterialTransactionDAO;
import dtos.IdOnly;
import dtos.requests.MaterialTransactionRequest;
import dtos.responses.MessageResponse;
import entities.*;
import jaxrs.validators.HiringTransactionValidator;
import org.eclipse.microprofile.jwt.Claim;
import org.eclipse.microprofile.jwt.ClaimValue;
import utils.Constants;
import utils.ModelConverter;

import javax.annotation.security.RolesAllowed;
import javax.inject.Inject;
import javax.json.JsonNumber;
import javax.validation.Valid;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Path("materialTransactions")
@RolesAllowed("contractor")
@Produces(MediaType.APPLICATION_JSON)

public class MaterialTransactionResource {


	@Inject
	MaterialDAO materialDAO;

	@Inject
	MaterialTransactionDAO materialTransactionDAO;
	@Inject
	ContractorDAO contractorDAO;

	@Inject
	ModelConverter modelConverter;

	@Inject
	HiringTransactionValidator validator;


	@Inject
	@Claim("contractorId")
	ClaimValue<JsonNumber> claimContractorId;

	private long getClaimContractorId() {
		return claimContractorId.getValue().longValue();
	}

	private void validateTransactionRequest(MaterialTransactionRequest materialTransactionRequest) {
//		MaterialEntity foundMaterial = materialDAO.findByIdWithValidation(materialTransactionRequest.getMaterial().getId());
		ContractorEntity foundRequester = contractorDAO.findByIdWithValidation(materialTransactionRequest.getRequester().getId());
//		ContractorEntity foundRequester = contractorDAO.findByIdWithValidation(materialTransactionRequest.ge().getId());


		// TODO: 3/25/19 when checkout transaction validate this - now debugging TransactionDetail
		//validate supplier cannot request his own material
//		if (foundMaterial.getContractor().getId() == foundRequester.getId()) {
//			throw new BadRequestException("You cannot request your own material!");
//		}


		//  1/30/19 check requester activation
		contractorDAO.validateContractorActivated(foundRequester);

	}

	@POST
	public Response checkoutTransaction(@Valid MaterialTransactionRequest materialTransactionRequest) {


		//3/10/19 get requester id from token
		materialTransactionRequest.setRequester(new IdOnly(claimContractorId.getValue().longValue()));

		validateTransactionRequest(materialTransactionRequest);

		// TODO: 4/8/19 separate into multiple transaction details by supplier id

		List<MaterialTransactionDetailEntity> materialTransactionDetailEntities =
				modelConverter.toEntityList(materialTransactionRequest.getMaterialTransactionDetails());
		for (MaterialTransactionDetailEntity detailEntity : materialTransactionDetailEntities) {
			detailEntity.setMaterial(materialDAO.findByIdWithValidation(detailEntity.getMaterial().getId()));
			// TODO: 4/8/19 validate can not request his own equipment
			if (detailEntity.getMaterial().getContractor().getId() == getClaimContractorId()) {
				throw new BadRequestException("You cannot request your own material!");
			}
		}

		List<MaterialTransactionEntity> separatedList = new ArrayList<>();
		HashMap<Long, Boolean> supplierIdBundle = new HashMap<>();
		for (MaterialTransactionDetailEntity detailEntity : materialTransactionDetailEntities) {

			long supplierId = detailEntity.getMaterial().getContractor().getId();
			if (supplierIdBundle.get(supplierId) == null || supplierIdBundle.get(supplierId) == false) {
				//not containt
				//continue
				supplierIdBundle.put(supplierId, true);

				// TODO: 4/8/19 new transaction
				MaterialTransactionEntity materialTransactionEntity = modelConverter.toEntity(materialTransactionRequest);

				// set supplier
				ContractorEntity tempSupplier = new ContractorEntity();
				tempSupplier.setId(supplierId);
				materialTransactionEntity.setSupplier(tempSupplier);

				materialTransactionEntity.getMaterialTransactionDetails().clear();
				List<MaterialTransactionDetailEntity> foundList = materialTransactionDetailEntities.stream().filter(materialTransactionDetailEntity ->
						materialTransactionDetailEntity.getMaterial().getContractor().getId() == supplierId)
						.collect(Collectors.toList());

				materialTransactionEntity.getMaterialTransactionDetails().addAll(foundList);
				separatedList.add(materialTransactionEntity);
			}

		}


		// TODO: 4/8/19 for each transaction entity
		for (MaterialTransactionEntity materialTransactionEntity : separatedList) {

			double totalPrice = 0;
			for (MaterialTransactionDetailEntity materialTransactionDetail : materialTransactionEntity.getMaterialTransactionDetails()) {
				MaterialEntity managedMaterial = materialTransactionDetail.getMaterial();
				materialTransactionDetail.setMaterialTransaction(materialTransactionEntity);
				materialTransactionDetail.setPrice(managedMaterial.getPrice());
				totalPrice += materialTransactionDetail.getPrice() * materialTransactionDetail.getQuantity();
			}

			// TODO: 3/25/19 do this after insert all the details
			materialTransactionEntity.setTotalPrice(totalPrice);
			//  1/30/19 set status to pending
			materialTransactionEntity.setStatus(MaterialTransactionEntity.Status.PENDING);
			materialTransactionDAO.persist(materialTransactionEntity);
		}

		return Response.status(Response.Status.CREATED).entity(
				separatedList.stream()
						.map(materialTransactionEntity -> materialTransactionDAO.findByID(materialTransactionEntity.getId()))
						.collect(Collectors.toList())
		).build();
	}

//	@POST
//	public Response requestTransaction(@Valid MaterialTransactionRequest materialTransactionRequest) {
//
//
//		//3/10/19 get requester id from token
//		materialTransactionRequest.setRequester(new IdOnly(claimContractorId.getValue().longValue()));
//
//		validateTransactionRequest(materialTransactionRequest);
//
//		MaterialTransactionEntity materialTransactionEntity = modelConverter.toEntityList(materialTransactionRequest);
//
//
//		MaterialEntity foundMaterial = materialDAO.findByIdWithValidation(materialTransactionEntity.getMaterial().getId());
//
//		materialTransactionEntity.setMaterialAddress(foundMaterial.getConstruction().getAddress());
//		materialTransactionEntity.setMaterialLong(foundMaterial.getConstruction().getLongitude());
//		materialTransactionEntity.setMaterialLat(foundMaterial.getConstruction().getLatitude());
//
//		materialTransactionEntity.setTotalPrice(foundMaterial.getPrice());
//		materialTransactionEntity.setUnit(foundMaterial.getMaterialType().getUnit());
//
//
//		//  1/30/19 set status to pending
//		materialTransactionEntity.setStatus(MaterialTransactionEntity.Status.PENDING);
//
//
//		materialTransactionDAO.persist(materialTransactionEntity);
//		return Response.status(Response.Status.CREATED).entity(
//				materialTransactionDAO.findByID(materialTransactionEntity.getId())
//		).build();
//	}

	@GET
	@Path("{id:\\d+}")
	public Response getTransaction(@PathParam("id") long id) {

		MaterialTransactionEntity foundTransaction = materialTransactionDAO.findByIdWithValidation(id);
		return Response.ok(foundTransaction).build();
	}

	@DELETE
	@Path("{id:\\d+}")
	public Response cancelTransaction(@PathParam("id") long id) {
		// TODO: 3/10/19 validate authority for requester

		MaterialTransactionEntity foundTransaction = materialTransactionDAO.findByIdWithValidation(id);
		if (getClaimContractorId() != foundTransaction.getRequester().getId()) {
			throw new BadRequestException("Only requester can cancel request");
		}

		if (foundTransaction.getStatus() != MaterialTransactionEntity.Status.PENDING) {
			throw new BadRequestException("You can only cancel PENDING transaction");
		}


		foundTransaction.setDeleted(true);
		materialTransactionDAO.merge(foundTransaction);

		return Response.status(Response.Status.OK).entity(new MessageResponse("Transaction deleted!")).build();
	}

	@PUT
	@Path("{id:\\d+}")
	public Response updateTransactionStatus(@PathParam("id") long id, MaterialTransactionEntity transactionEntity) {

		MaterialTransactionEntity foundTransaction = materialTransactionDAO.findByIdWithValidation(id);
		if (transactionEntity.getStatus() == null) {
			throw new BadRequestException("Status is null!");
		}


		long supplierId = foundTransaction.getSupplier().getId();
		long requesterId = foundTransaction.getRequester().getId();

		switch (transactionEntity.getStatus()) {
			case PENDING:
				//validate
				if (foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}
				break;
			case ACCEPTED:
				//validate
				if (getClaimContractorId() != supplierId) {
					throw new BadRequestException("Only supplier can change this status!");
				}
				// TODO: 3/10/19 validate status
				//  4/3/19 validate if active
				if (!foundTransaction.getSupplier().isActivated()) {
					throw new BadRequestException(String.format("Supplier %s is %s",
							foundTransaction.getSupplier().getName(), foundTransaction.getSupplier().getStatus().getBeautifiedName()));
				}

				if (foundTransaction.getStatus() != MaterialTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));

				}

				break;
			case DENIED:
				//validate

				if (getClaimContractorId() != supplierId) {
					throw new BadRequestException("Only supplier can change this status!");
				}

				if (foundTransaction.getStatus() != MaterialTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}
				break;
			case DELIVERING:
				//validate
				if (getClaimContractorId() != supplierId) {
					throw new BadRequestException("Only supplier can change this status!");
				}

				if (foundTransaction.getStatus() != MaterialTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));


				}
				break;
			case CANCELED:
				//
				if (getClaimContractorId() != requesterId && getClaimContractorId() != supplierId) {
					throw new BadRequestException("Only requester or supplier can cancel material transaction!");
				}
				//validate
				if ( foundTransaction.getStatus() != MaterialTransactionEntity.Status.PENDING
						&& foundTransaction.getStatus() != MaterialTransactionEntity.Status.DELIVERING
						&& foundTransaction.getStatus() != MaterialTransactionEntity.Status.ACCEPTED
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {
					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}
				foundTransaction.setCancelReason(transactionEntity.getCancelReason());

				//canceledBy
				ContractorEntity canceledBy = new ContractorEntity();
				canceledBy.setId(getClaimContractorId());
				foundTransaction.setCanceledBy(canceledBy);

				break;
			case FINISHED:
				if (getClaimContractorId() != requesterId) {
					throw new BadRequestException("Only requester can change this status!");
				}

				//validate
				if (foundTransaction.getStatus() != MaterialTransactionEntity.Status.DELIVERING
						&& foundTransaction.getStatus() != transactionEntity.getStatus()) {

					throw new BadRequestException(String.format("Cannot change from %s to %s",
							foundTransaction.getStatus(), transactionEntity.getStatus()));
				}
				break;

		}

		foundTransaction.setStatus(transactionEntity.getStatus());
		materialTransactionDAO.merge(foundTransaction);
		return Response.status(Response.Status.OK).entity(materialTransactionDAO.findByID(id)).build();
	}

	@GET
	@Path("supplier/{id:\\d+}")
	public Response getReceivedTransactionAsSupplier(
			@PathParam("id") long supplierId
			, @QueryParam("status") MaterialTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {


		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		if (supplierId != claimContractorId.getValue().longValue()) {
			throw new BadRequestException("You cannot view other people's transaction");
		}

		//validate supplierId
		ContractorEntity foundContractor = contractorDAO.findByID(supplierId);
		if (foundContractor == null) {
			//custom message for supplier not contractor
			throw new BadRequestException(String.format("Supplier id=%d not found", supplierId));
		}

		;

		return Response.ok(materialTransactionDAO.getMaterialTransactionsBySupplierId(supplierId, status, limit, offset, orderBy)).build();

	}


	@GET
	@Path("requester/{id:\\d+}")
	public Response getSentTransactionsAsRequester(
			@PathParam("id") long requesterId
			, @QueryParam("status") MaterialTransactionEntity.Status status
			, @QueryParam("limit") @DefaultValue(Constants.DEFAULT_RESULT_LIMIT) int limit
			, @QueryParam("offset") @DefaultValue("0") int offset
			, @QueryParam("orderBy") @DefaultValue("id.asc") String orderBy) {


		if (!orderBy.matches(Constants.RESOURCE_REGEX_ORDERBY)) {
			throw new BadRequestException("orderBy param format must be " + Constants.RESOURCE_REGEX_ORDERBY);
		}

		if (requesterId != claimContractorId.getValue().longValue()) {
			throw new BadRequestException("You cannot view other people's transaction");
		}

		ContractorEntity foundContractor = contractorDAO.findByID(requesterId);
		if (foundContractor == null) {
			//custom message for requester not contractor
			throw new BadRequestException(String.format("requester id=%s not found!", requesterId));
		}


		return Response.ok(materialTransactionDAO
				.getMaterialTransactionsByRequesterId(requesterId, status, limit, offset, orderBy)).build();
	}



}
