package daos;

import entities.MaterialFeedbackEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class MaterialFeedbackDAO extends BaseDAO<MaterialFeedbackEntity, Long> {
	public List<MaterialFeedbackEntity> getFeedbacksBySupplier(long supplierId) {
		return entityManager.createNamedQuery("MaterialFeedbackEntity.bySupplier", MaterialFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.getResultList();
	}

	public List<MaterialFeedbackEntity> getFeedbacksByMaterial(long materialId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialFeedbackEntity.byMaterial", MaterialFeedbackEntity.class)
				.setParameter("materialId", materialId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();


	}
}
