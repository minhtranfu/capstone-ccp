package listeners.entityListenters;

import daos.DebrisFeedbackDAO;
import daos.DebrisTransactionDAO;
import dtos.notifications.NotificationDTO;
import entities.*;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.ws.rs.BadRequestException;

public class DebrisFeedbackEntityListener {
	@Inject
	DebrisTransactionDAO debrisTransactionDAO;

	@Inject
	DebrisFeedbackDAO debrisFeedbackDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;


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

	@PostPersist
	void postPersist(DebrisFeedbackEntity entity) {
		entity = debrisFeedbackDAO.findByIdWithValidation(entity.getId());

		ContractorEntity supplier = entity.getSupplier();
		ContractorEntity requester = entity.getRequester();
		DebrisPostEntity debrisPost = entity.getDebrisTransaction().getDebrisPost();
		firebaseMessagingManager.sendMessage(new NotificationDTO(String.format("New feedback from %s", requester.getName()),
				String.format("%s have accepted to feedback you after completing \"%s\"",requester.getName(), debrisPost.getTitle())
				, supplier.getId()
				, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS
				, entity.getDebrisTransaction().getId())));

	}
}
