package daos;

import entities.ContractorAccountEntity;

import javax.ejb.Stateless;
import javax.ws.rs.BadRequestException;
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
		return entityManager.createNamedQuery("ContractorAccountEntity.findByUsername",ContractorAccountEntity.class)
				.setParameter("username", username)
				.getResultList();
	}

	public ContractorAccountEntity findByContractorIdWithValidation(long contractorId) {
		List<ContractorAccountEntity> contractorAccountEntities = entityManager.createNamedQuery("ContractorAccountEntity.findByContractorId", ContractorAccountEntity.class)
				.setParameter("contractorId", contractorId)
				.getResultList();

		if (contractorAccountEntities.isEmpty()) {
			throw new BadRequestException(String.format("Contractor Id=%s not found!", contractorId));
		}
		return contractorAccountEntities.get(0);
	}
}
