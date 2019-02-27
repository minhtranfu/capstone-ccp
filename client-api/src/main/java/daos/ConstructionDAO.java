package daos;

import entities.ConstructionEntity;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Stateless
public class ConstructionDAO extends BaseDAO<ConstructionEntity, Long> {

	@PersistenceContext
	EntityManager entityManager;

	@Override
	public void persist(ConstructionEntity constructionEntity) {
		entityManager.persist(constructionEntity);
//		super.persist(constructionEntity);
	}
}
