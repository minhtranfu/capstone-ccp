package daos;

import entities.ContractorAccountEntity;

import java.util.List;

public class ContractorAccountDAO extends BaseDAO<ContractorAccountEntity, Long> {


	public List<ContractorAccountEntity> findAccountsByUsernamePassword(String username, String password) {
		List<ContractorAccountEntity> resultList = entityManager.createNamedQuery
				("ContractorAccountEntity.validateAccount", ContractorAccountEntity.class)
				.setParameter("password", password)
				.setParameter("username", username)
				.getResultList();
		return resultList;
	}
}
