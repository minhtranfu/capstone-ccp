package listeners.entityListenters;

import daos.EquipmentFeedbackDAO;
import daos.HiringTransactionDAO;
import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.EquipmentFeedbackEntity;
import entities.HiringTransactionEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.ws.rs.BadRequestException;

public class EquipmentFeedbackEntityListener {


	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	EquipmentFeedbackDAO equipmentFeedbackDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;


	private void auditRequesterSupplier(EquipmentFeedbackEntity entity) {
		HiringTransactionEntity managedTransaction = hiringTransactionDAO.findByIdWithValidation
				(entity.getHiringTransaction().getId());

		// 3/21/19 validate only 1 feedback
		if (managedTransaction.getEquipmentFeedback() != null) {
			throw new BadRequestException("This transaction already has feedback");
		}
		entity.setRequester(managedTransaction.getRequester());
		entity.setSupplier(managedTransaction.getEquipment().getContractor());
	}

	@PrePersist
	void prePersist(EquipmentFeedbackEntity entity) {
		auditRequesterSupplier(entity);
	}

	@PreUpdate
	void preUpdate(EquipmentFeedbackEntity entity) {
		auditRequesterSupplier(entity);
	}

	@PostPersist
	void postPersist(EquipmentFeedbackEntity entity) {
		entity = equipmentFeedbackDAO.findByIdWithValidation(entity.getId());

		ContractorEntity supplier = entity.getSupplier();
		ContractorEntity requester = entity.getRequester();
		HiringTransactionEntity hiringTransaction = entity.getHiringTransaction();

		firebaseMessagingManager.sendMessage(new NotificationDTO(String.format("Feedback from %s for Hiring services", requester.getName()),
				String.format("%s has sent a feedback about \"%s\" after a hiring transaction", requester.getName(),
						hiringTransaction.getEquipment().getName())
				, supplier.getId()
				, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS,
				hiringTransaction.getId()))
		);

	}
}
