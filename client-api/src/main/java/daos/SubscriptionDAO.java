package daos;

import entities.EquipmentEntity;
import entities.SubscriptionEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;

public class SubscriptionDAO extends BaseDAO<SubscriptionEntity, Long> {

	public List<SubscriptionEntity> getMatchedSubscriptions(EquipmentEntity equipmentEntity) {
		if (equipmentEntity.getStatus() != EquipmentEntity.Status.AVAILABLE) {
			return new ArrayList<>();
		}


		EntityManager entityManager = DBUtils.getEntityManager();
		List<SubscriptionEntity> matchedSubscriptions =
				entityManager.createNamedQuery("SubscriptionEntity.matchEquipment", SubscriptionEntity.class)
						.setParameter("equipmentId", equipmentEntity.getId())
						.setParameter("equipmentTypeId", equipmentEntity.getEquipmentType().getId())
						.setParameter("dailyPrice", equipmentEntity.getDailyPrice())
						.getResultList();
		return matchedSubscriptions;


	}
}
