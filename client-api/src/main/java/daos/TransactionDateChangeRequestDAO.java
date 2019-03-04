package daos;

import entities.TransactionDateChangeRequestEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.ws.rs.BadRequestException;
import java.util.List;

@Stateless
public class TransactionDateChangeRequestDAO extends BaseDAO<TransactionDateChangeRequestEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;
	public void validateOnlyOnePendingRequest(long transactionId) {
		int count =  entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList().size();
		if (count != 0) {
			throw new BadRequestException("this transaction already has another pending requests!");
		}
	}

	public List<TransactionDateChangeRequestEntity> getRequestsByTransactionId(long transactionId) {


		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getRequestsByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList();

	}
	public List<TransactionDateChangeRequestEntity> getPendingRequestByTransactionId(long transactionId) {


		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList();

	}
}
