package daos;

import entities.EquipmentEntity;
import entities.SubscriptionEntity;
import utils.DBUtils;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.List;


@Stateless
public class SubscriptionDAO extends BaseDAO<SubscriptionEntity, Long> {

	@PersistenceContext(unitName = DBUtils.PERSISTANCE_UNIT)
	EntityManager entityManager;
	public List<SubscriptionEntity> getMatchedSubscriptions(EquipmentEntity equipmentEntity) {
		if (equipmentEntity.getStatus() != EquipmentEntity.Status.AVAILABLE) {
			return new ArrayList<>();
		}


		List<SubscriptionEntity> matchedSubscriptions =
				entityManager.createNamedQuery("SubscriptionEntity.matchEquipment", SubscriptionEntity.class)
						.setParameter("equipmentId", equipmentEntity.getId())
						.setParameter("equipmentTypeId", equipmentEntity.getEquipmentType().getId())
						.setParameter("dailyPrice", equipmentEntity.getDailyPrice())
						.getResultList();
		return matchedSubscriptions;


	}
}
