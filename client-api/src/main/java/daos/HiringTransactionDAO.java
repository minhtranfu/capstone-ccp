package daos;

import entities.HiringTransactionEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class HiringTransactionDAO extends BaseDAO<HiringTransactionEntity, Long> {
	public List<HiringTransactionEntity> getHiringTransactionsBySupplierId(long supplierId) {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionBySupplierId")
				.setParameter("supplierId", supplierId)
				.getResultList();
	}
}
