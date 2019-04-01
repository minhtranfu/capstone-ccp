package daos;

import entities.DebrisBidEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class DebrisBidDAO extends BaseDAO<DebrisBidEntity,Long> {
	public List<DebrisBidEntity> getBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisBidEntity.bySupplier", DebrisBidEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();

	}
}

