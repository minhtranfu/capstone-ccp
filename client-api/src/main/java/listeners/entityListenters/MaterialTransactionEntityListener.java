package listeners.entityListenters;

import daos.MaterialTransactionDAO;
import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.MaterialTransactionEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

public class MaterialTransactionEntityListener {

	@Inject
	MaterialTransactionDAO materialTransactionDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;


	@PostUpdate
	void postUpdate(MaterialTransactionEntity entity) {
		entity = materialTransactionDAO.findByID(entity.getId());
		//  notify receiver about hiring trasnction changed
		ContractorEntity requester = entity.getRequester();
		ContractorEntity supplier = entity.getSupplier();

		switch (entity.getStatus()) {
			case PENDING:
				//already done in insert
				break;
			case ACCEPTED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials are preparing",
						String.format("Your material transaction #%s is Accepted and being prepared by %s",
								entity.getId(), supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));
				break;

			case DENIED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials transaction Denied",
						String.format("Your material transaction #%s is Denied by %s",
								entity.getId(), supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));
				break;
			case DELIVERING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials is Delivering!",
						String.format("The material transaction is delivering to you by %s. You can check it status with id #%s",
								entity.getId()
								, supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));

				break;

			case FINISHED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials Received",
						String.format("Requester %s have Received the materials and Finished the transaction"
								, requester.getName())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));
				break;
			case CANCELED:

				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials transaction Canceled",
						String.format("Materials transaction #%s has been Canceled"
								, entity.getId())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));
				firebaseMessagingManager.sendMessage(new NotificationDTO("Materials transaction Canceled",
						String.format("Materials transaction #%s has been Canceled"
								, entity.getId())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));

				break;
		}
	}


	@PostPersist
	void postPersist(MaterialTransactionEntity entity) {

		entity = materialTransactionDAO.findByID(entity.getId());
		ContractorEntity supplier = entity.getSupplier();
		firebaseMessagingManager.sendMessage(new NotificationDTO("New Pending materials request",
				String.format("You have a new materials request for from %s", supplier.getName())
				, supplier.getId()
				, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS, entity.getId())));

	}
}
