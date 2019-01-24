package utils;

import javax.enterprise.context.RequestScoped;
import javax.enterprise.inject.Disposes;
import javax.enterprise.inject.Produces;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.PersistenceUnit;


//*This use CDI and required running tomee as a application server*/
@RequestScoped
public class EntityManagerProducer {

	@PersistenceUnit
	EntityManagerFactory factory;


	@Produces
	@RequestScoped
	public EntityManager newEntityManager() {
		return factory.createEntityManager();
	}

	private void closeEntityManager(@Disposes EntityManager entityManager) {
		entityManager.close();

	}
}
