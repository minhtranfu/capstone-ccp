package daos;

import entities.EquipmentFeedbackEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class EquipmentFeedbackDAO extends BaseDAO<EquipmentFeedbackEntity, Long> {
	public List<EquipmentFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("EquipmentFeedbackEntity.bySupplier", EquipmentFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}
}
