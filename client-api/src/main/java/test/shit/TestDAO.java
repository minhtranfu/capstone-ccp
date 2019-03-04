package test.shit;

import entities.FeedbackEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;

@Stateless
public class TestDAO {

	@PersistenceContext(type = PersistenceContextType.TRANSACTION)
	EntityManager entityManager;

	public FeedbackEntity testGetFeedbackEntityId(long id) {
		return entityManager.find(FeedbackEntity.class, id);
	}


}
