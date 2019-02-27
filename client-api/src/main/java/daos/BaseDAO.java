package daos;



import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;
import java.lang.reflect.ParameterizedType;
import java.util.List;


public class BaseDAO<T, PK> implements IGeneticDAO<T, PK> {


	@PersistenceContext
	EntityManager entityManager;

	protected Class<T> entityClass;

	public BaseDAO() {
		ParameterizedType geneticSupperClass = (ParameterizedType) this.getClass().getGenericSuperclass();
		entityClass = (Class<T>) geneticSupperClass.getActualTypeArguments()[0];

	}


//	@Transactional
	public void persist(T t) {
		entityManager.persist(t);
	}


	public T findByID(PK id) {
		return entityManager.find(entityClass, id);
	}

	public void delete(T t) {
		entityManager.remove(entityManager.contains(t) ? t : entityManager.merge(t));
	}

	public T merge(T t) {
		T managedEntity;
		managedEntity = entityManager.merge(t);

		return managedEntity;
	}


	public List<T> getAll(String queryName) {
		Query namedQuery = entityManager.createNamedQuery(queryName);
		return namedQuery.getResultList();
	}
}
