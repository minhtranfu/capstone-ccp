package daos;

import entities.ContractorAccountEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class ContractorAccountDAO extends BaseDAO<ContractorAccountEntity, Long> {


	public List<ContractorAccountEntity> findAccountsByUsernamePassword(String username, String password) {
		List<ContractorAccountEntity> resultList = entityManager.createNamedQuery
				("ContractorAccountEntity.validateAccount", ContractorAccountEntity.class)
				.setParameter("password", password)
				.setParameter("username", username)
				.getResultList();
		return resultList;
	}

	public List<ContractorAccountEntity> findByUsername(String username) {
		return entityManager.createNamedQuery("ContractorAccountEntity.findByUsername")
				.setParameter("username", username)
				.getResultList();
	}
}
