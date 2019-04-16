package daos;

import entities.ContractorEntity;

import javax.ejb.Stateless;
import javax.ws.rs.BadRequestException;

@Stateless
public class ContractorDAO extends BaseDAO<ContractorEntity, Long> {

	public void validateContractorActivated(long contractorId) {
		ContractorEntity managedContractorEntity = findByIdWithValidation(contractorId);
		validateContractorActivated(managedContractorEntity);
	}

	public void validateContractorActivated(ContractorEntity managedContractorEntity) {
		if (managedContractorEntity.getStatus() != ContractorEntity.Status.ACTIVATED) {
			throw new BadRequestException(String.format("Contractor id=%d must be activated"
					, managedContractorEntity.getId()));
		}
	}


	public long countFinishedDebrisTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedDebrisTransactionBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}
	public long countFinishedMaterialTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedMaterialTransactionBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}
	public long countFinishedHiringTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedHiringTransactionBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}
	public long countFinishedCanceledDebrisTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedCanceledDebrisTransactionRateBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}
	public long countFinishedCanceleMaterialTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedCanceledMaterialTransactionBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}
	public long countFinishedCanceleHiringTransactionRateBySupplierId(long supplierId) {
		return entityManager.createNamedQuery("ContractorEntity.finishedCanceledHiringTransactionBySupplierId", Long.class)
				.setParameter("supplierId", supplierId)
				.getSingleResult();
	}



}
