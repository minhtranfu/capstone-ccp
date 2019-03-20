package daos;

import entities.DebrisPostEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class DebrisPostDAO extends BaseDAO<DebrisPostEntity, Long> {
	public List<DebrisPostEntity> getByRequester(long requesterId) {
		return entityManager.createNamedQuery("DebrisPostEntity.byRequester", DebrisPostEntity.class)
				.setParameter("requesterId", requesterId)
				.getResultList();

	}
}
