package daos;

import entities.CartRequestEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import java.util.List;

public class CartRequestDAO extends BaseDAO<CartRequestEntity, Long> {

	public List<CartRequestEntity> getCartByContractorId(long contractorId) {
		EntityManager entityManager = DBUtils.getEntityManager();

		return entityManager.createNamedQuery("CartRequestEntity.getByContractorId", CartRequestEntity.class)
				.setParameter("contractorId", contractorId)
				.getResultList();
	}

}
