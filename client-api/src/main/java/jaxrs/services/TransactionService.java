package jaxrs.services;

import daos.HiringTransactionDAO;
import entities.HiringTransactionEntity;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

@Path("transactions")
public class TransactionService {

	private static final HiringTransactionDAO hiringTransactionDAO = new HiringTransactionDAO();

	@POST
	public Response requestTransaction(HiringTransactionEntity hiringTransactionEntity) {
		hiringTransactionEntity.setId(0);
		hiringTransactionDAO.persist(hiringTransactionEntity);

		return Response.status(Response.Status.CREATED).entity(new HiringTransactionEntity()).build();
	}
}
