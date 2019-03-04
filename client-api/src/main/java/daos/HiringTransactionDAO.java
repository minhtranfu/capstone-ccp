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

	public List<HiringTransactionEntity> getHiringTransactionsBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionBySupplierId")
				.setParameter("supplierId", supplierId)
				.getResultList();
	}

	public List<HiringTransactionEntity> getHiringTransactionsByRequesterId(long requesterId) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionsByRequesterId")
				.setParameter("requesterId", requesterId)
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
		return entityManager.createNamedQuery("HiringTransactionEntity.getPendingTransactionIntersectingWith")
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();
	}



}
