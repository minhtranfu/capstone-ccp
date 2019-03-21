package daos;

import entities.DebrisTransactionEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class DebrisTransactionDAO extends BaseDAO<DebrisTransactionEntity, Long> {
	public List<DebrisTransactionEntity> getDebrisTransactionsBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.bySupplier", DebrisTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.getResultList();
	}

	public List<DebrisTransactionEntity> getDebrisTransactionsByRequesterId(long requesterId) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.byRequester", DebrisTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.getResultList();
	}
}
