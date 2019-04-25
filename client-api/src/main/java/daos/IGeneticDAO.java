package daos;

import java.util.List;

public interface IGeneticDAO<T, PK> {
	void persist(T t);

	T findByID(PK id);


	void delete(T t);


	T merge(T t);
	List<T> getByNamedQuery(String queryName);

	List<T> findAll(boolean includeDeleted);

}
