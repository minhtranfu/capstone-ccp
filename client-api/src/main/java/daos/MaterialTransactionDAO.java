package daos;

import entities.HiringTransactionEntity;
import entities.MaterialTransactionEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class MaterialTransactionDAO extends BaseDAO<MaterialTransactionEntity, Long> {
	public List<MaterialTransactionEntity> getMaterialTransactionsBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.BySupplierId", MaterialTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.getResultList();

	}


	public List<MaterialTransactionEntity> getMaterialTransactionsByRequeseterId(long requesterId) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.ByRequesterId", MaterialTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.getResultList();
	}
}
