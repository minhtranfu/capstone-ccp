package daos;



import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;
import javax.ws.rs.BadRequestException;
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


	public List<T> getByNamedQuery(String queryName) {
		Query namedQuery = entityManager.createNamedQuery(queryName);
		return namedQuery.getResultList();
	}

	public T findByIdWithValidation(PK id) {
		T entity = this.findByID(id);
		if (entity == null) {
			throw new BadRequestException(String.format("%s id=%s not found!", entityClass.getSimpleName(), id));
		}
		return entity;
	}

	public List<T> findAll() {
		CriteriaBuilder cb = entityManager.getCriteriaBuilder();
		CriteriaQuery<T> cq = cb.createQuery(entityClass);
		Root<T> rootEntry = cq.from(entityClass);
		CriteriaQuery<T> all = cq.select(rootEntry);
		TypedQuery<T> allQuery = entityManager.createQuery(all);
		return allQuery.getResultList();
	}
}
