package daos;

import entities.HiringTransactionEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.time.LocalDate;
import java.util.List;

@Stateless
public class HiringTransactionDAO extends BaseDAO<HiringTransactionEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;

	public List<HiringTransactionEntity> getHiringTransactionsBySupplierId(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionBySupplierId", HiringTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	public List<HiringTransactionEntity> getHiringTransactionsByRequesterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionsByRequesterId", HiringTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	/* There's no PROCESSING transaction related to this equipment*/
	public List<HiringTransactionEntity> getProcessingTransactionsByEquipmentId(long equipmentId) {

		List<HiringTransactionEntity> hiringTransactionEntities = entityManager.createNamedQuery("HiringTransactionEntity.getProcessingTransactionsByEquipmentId", HiringTransactionEntity.class)
				.setParameter("equipmentId", equipmentId)
				.getResultList();

		return hiringTransactionEntities;

	}

	public List<HiringTransactionEntity> getPendingTransactionIntersectingWith(long equipmentId, LocalDate beginDate, LocalDate endDate){
		return entityManager.createNamedQuery("HiringTransactionEntity.getPendingTransactionIntersectingWith",HiringTransactionEntity.class)
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();
	}



}
