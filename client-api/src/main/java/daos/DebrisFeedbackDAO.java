package daos;

import entities.DebrisFeedbackEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class DebrisFeedbackDAO extends BaseDAO<DebrisFeedbackEntity, Long> {
	public List<DebrisFeedbackEntity> getFeedbacksBySupplier(long supplierId) {
		return entityManager.createNamedQuery("DebrisFeedbackEntity.bySupplier", DebrisFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.getResultList();
	}
}
