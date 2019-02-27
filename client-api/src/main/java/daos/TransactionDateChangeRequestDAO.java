package daos;

import entities.TransactionDateChangeRequestEntity;
import utils.DBUtils;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class TransactionDateChangeRequestDAO extends BaseDAO<TransactionDateChangeRequestEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;
	public boolean validateNewRequest(long transactionId) {
		int count =  entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList().size();
		return count == 0;
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
