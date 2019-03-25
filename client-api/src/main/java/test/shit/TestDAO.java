package test.shit;

import entities.ReportEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

@Stateless
public class TestDAO {

	@PersistenceContext(type = PersistenceContextType.TRANSACTION)
	EntityManager entityManager;

	public ReportEntity testGetFeedbackEntityId(long id) {
		return entityManager.find(ReportEntity.class, id);
	}


}
