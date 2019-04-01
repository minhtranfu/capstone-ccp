package daos;

import entities.DebrisTransactionEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class DebrisTransactionDAO extends BaseDAO<DebrisTransactionEntity, Long> {
	public List<DebrisTransactionEntity> getDebrisTransactionsBySupplierId(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.bySupplier", DebrisTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public List<DebrisTransactionEntity> getDebrisTransactionsByRequesterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.byRequester", DebrisTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}
}
