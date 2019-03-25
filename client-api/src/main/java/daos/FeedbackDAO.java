package daos;

import entities.ReportEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;


@Stateless
public class FeedbackDAO extends BaseDAO<ReportEntity, Long> {

	@PersistenceContext(type = PersistenceContextType.TRANSACTION)
	EntityManager entityManager;

	@Override
	public ReportEntity findByID(Long id) {
		return entityManager.find(ReportEntity.class, id);
	}

	@Override
	public void persist(ReportEntity reportEntity) {

		entityManager.persist(reportEntity);
//		super.persist(feedbackEntity);
	}

	@Override
	public ReportEntity merge(ReportEntity reportEntity) {

		return entityManager.merge(reportEntity);
//		return super.merge(feedbackEntity);
	}

	@Override
	public void delete(ReportEntity reportEntity) {
		entityManager.remove(entityManager.contains(reportEntity)
				? reportEntity : entityManager.merge(reportEntity));
	}
}
