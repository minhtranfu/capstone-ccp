package daos;

import entities.TransactionDateChangeRequestEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class TransactionDateChangeRequestDAO extends BaseDAO<TransactionDateChangeRequestEntity, Long> {
	public boolean validateNewRequest(long transactionId) {
		EntityManager entityManager = DBUtils.getEntityManager();
		int count =  entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList().size();
		return count == 0;
	}

	public List<TransactionDateChangeRequestEntity> getRequestsByTransactionId(long transactionId) {


		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getRequestsByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList();

	}
	public List<TransactionDateChangeRequestEntity> getPendingRequestByTransactionId(long transactionId) {


		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList();

	}
}
