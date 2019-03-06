package daos;

import entities.ContractorAccountEntity;

public class ContractorAccountDAO extends BaseDAO<ContractorAccountEntity, Long> {


	public boolean validateAccount(String username, String password) {
		boolean validated = entityManager.createNamedQuery
				("ContractorAccountEntity.validateAccount", Boolean.class)
				.setParameter("password", password)
				.setParameter("username", username)
				.getSingleResult();
		return validated;
	}
}
