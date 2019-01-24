package dao;


import utils.DBUtils;

import javax.persistence.EntityManager;
import javax.persistence.Query;
import java.lang.reflect.ParameterizedType;
import java.util.List;

public class BaseDAO<T, PK> implements IGeneticDAO<T,PK>{
	protected Class<T> entityClass;
	public BaseDAO() {
		ParameterizedType geneticSupperClass = (ParameterizedType) this.getClass().getGenericSuperclass();
		entityClass = (Class<T>) geneticSupperClass.getActualTypeArguments()[0];

	}


	public void persist(T t) {
		EntityManager entityManager = DBUtils.getEntityManager();
		entityManager.getTransaction().begin();
		entityManager.persist(t);
		entityManager.getTransaction().commit();
	}

	public T findByID(PK id) {
		EntityManager entityManager = DBUtils.getEntityManager();
		return entityManager.find(entityClass, id);
	}

	public void delete(T t) {
		EntityManager entityManager = DBUtils.getEntityManager();
		entityManager.getTransaction().begin();
		entityManager.remove(t);
		entityManager.getTransaction().commit();	}

	public void merge(T t) {
		EntityManager entityManager = DBUtils.getEntityManager();
		entityManager.getTransaction().begin();
		entityManager.merge(t);
		entityManager.getTransaction().commit();

	}

	public List<T> getAll(String queryName) {
		EntityManager entityManager = DBUtils.getEntityManager();
		Query namedQuery = entityManager.createNamedQuery(queryName);
		return namedQuery.getResultList();
	}
}
