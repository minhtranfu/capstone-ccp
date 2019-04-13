package daos;

import entities.ReportTypeEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class FeedbackTypeDAO extends BaseDAO<ReportTypeEntity,Long> {

	public List<ReportTypeEntity> findAll() {
		return entityManager.createNamedQuery("FeedbackTypeEntity.getAll", ReportTypeEntity.class).getResultList();
	}
}
