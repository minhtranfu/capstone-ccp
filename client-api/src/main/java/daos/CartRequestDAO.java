package daos;

import entities.CartRequestEntity;
import utils.DBUtils;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Stateless
public class CartRequestDAO extends BaseDAO<CartRequestEntity, Long> {

	@PersistenceContext
	EntityManager entityManager;
	public List<CartRequestEntity> getCartByContractorId(long contractorId) {

		return entityManager.createNamedQuery("CartRequestEntity.getByContractorId", CartRequestEntity.class)
				.setParameter("contractorId", contractorId)
				.getResultList();
	}

}
