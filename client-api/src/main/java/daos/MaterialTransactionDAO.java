package daos;

import entities.HiringTransactionEntity;
import entities.MaterialTransactionEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class MaterialTransactionDAO extends BaseDAO<MaterialTransactionEntity, Long> {
	public List<MaterialTransactionEntity> getMaterialTransactionsBySupplierId(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.BySupplierId", MaterialTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();

	}


	public List<MaterialTransactionEntity> getMaterialTransactionsByRequeseterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.ByRequesterId", MaterialTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}
}
