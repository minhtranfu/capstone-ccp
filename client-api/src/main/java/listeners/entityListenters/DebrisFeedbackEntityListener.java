package listeners.entityListenters;

import daos.DebrisTransactionDAO;
import entities.DebrisFeedbackEntity;
import entities.DebrisTransactionEntity;

import javax.inject.Inject;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.ws.rs.BadRequestException;

public class DebrisFeedbackEntityListener {
	@Inject
	DebrisTransactionDAO debrisTransactionDAO;


	private void auditRequesterSupplier(DebrisFeedbackEntity entity) {
		DebrisTransactionEntity managedTransaction = debrisTransactionDAO.findByIdWithValidation(entity.getDebrisTransaction().getId());

		// 3/21/19 validate only 1 feedback
		if (managedTransaction.getDebrisFeedback() != null) {
			throw new BadRequestException("This transaction already has feedback");
		}
		entity.setRequester(managedTransaction.getRequester());
		entity.setSupplier(managedTransaction.getSupplier());
	}

	@PrePersist
	void prePersist(DebrisFeedbackEntity entity) {
		auditRequesterSupplier(entity);

	}

	@PreUpdate
	void preUpdate(DebrisFeedbackEntity entity) {
		auditRequesterSupplier(entity);
	}
}
