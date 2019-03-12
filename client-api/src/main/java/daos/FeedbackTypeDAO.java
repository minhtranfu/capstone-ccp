package daos;

import entities.FeedbackTypeEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class FeedbackTypeDAO extends BaseDAO<FeedbackTypeEntity,Long> {

	public List<FeedbackTypeEntity> findAll() {
		return entityManager.createNamedQuery("FeedbackTypeEntity.getAll", FeedbackTypeEntity.class).getResultList();
	}
}
