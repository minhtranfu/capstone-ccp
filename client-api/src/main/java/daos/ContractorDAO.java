package daos;

import entities.ContractorEntity;

import javax.ejb.Singleton;
import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.BadRequestException;

@Stateless
public class ContractorDAO extends BaseDAO<ContractorEntity, Long> {

	public void validateContractorActivated(long contractorId) {
		ContractorEntity managedContractorEntity = findByIdWithValidation(contractorId);
		validateContractorActivated(managedContractorEntity);
	}

	public void validateContractorActivated(ContractorEntity managedContractorEntity) {
		if (managedContractorEntity.getStatus() == ContractorEntity.Status.DEACTIVATED) {
			throw new BadRequestException(String.format("Contractor id=%d must be activated"
					, managedContractorEntity.getId()));
		}
	}


}
