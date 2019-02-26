package daos;

import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.time.LocalDate;
import java.util.List;

public class HiringTransactionDAO extends BaseDAO<HiringTransactionEntity, Long> {
	public List<HiringTransactionEntity> getHiringTransactionsBySupplierId(long supplierId) {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionBySupplierId")
				.setParameter("supplierId", supplierId)
				.getResultList();
	}

	public List<HiringTransactionEntity> getHiringTransactionsByRequesterId(long requesterId) {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionsByRequesterId")
				.setParameter("requesterId", requesterId)
				.getResultList();
	}

	/* There's no PROCESSING transaction related to this equipment*/
	public List<HiringTransactionEntity> getProcessingTransactionsByEquipmentId(long equipmentId) {
		EntityManager entityManager = DBUtils.getEntityManager();

		List<HiringTransactionEntity> hiringTransactionEntities = entityManager.createNamedQuery("HiringTransactionEntity.getProcessingTransactionsByEquipmentId", HiringTransactionEntity.class)
				.setParameter("equipmentId", equipmentId)
				.getResultList();

		return hiringTransactionEntities;

	}

	public List<HiringTransactionEntity> getPendingTransactionIntersectingWith(long equipmentId, LocalDate beginDate, LocalDate endDate){
		return DBUtils.getEntityManager().createNamedQuery("HiringTransactionEntity.getPendingTransactionIntersectingWith")
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();
	}



}
