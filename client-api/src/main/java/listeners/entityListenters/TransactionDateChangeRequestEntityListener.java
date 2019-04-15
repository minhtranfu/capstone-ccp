package listeners.entityListenters;

import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.TransactionDateChangeRequestEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

public class TransactionDateChangeRequestEntityListener {

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	@PostUpdate
	void postUpdate(TransactionDateChangeRequestEntity entity) {
		EquipmentEntity equipment = entity.getHiringTransactionEntity().getEquipment();
		ContractorEntity supplier = equipment.getContractor();
		ContractorEntity requester = entity.getHiringTransactionEntity().getRequester();
		switch (entity.getStatus()) {
			case PENDING:
				//already notified in persist
				break;
			case CANCELED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Time extension request Canceled",
						String.format("%s canceled request for hiring time extension for \"%s\"",
								requester.getName()
								, equipment.getName())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTION_DATE_CHANGE_REQUESTS, entity.getId())));
				break;

			case ACCEPTED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Time extension request Accepted",
						String.format("%s accepted to extend hiring time for \"%s\"",
								supplier.getName()
								, equipment.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTION_DATE_CHANGE_REQUESTS, entity.getId())));

				break;
			case DENIED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Time extension request Denied",
						String.format("%s denied to extend hiring time for \"%s\"",
								supplier.getName()
								, equipment.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTION_DATE_CHANGE_REQUESTS, entity.getId())));

				break;
		}
	}

	@PostPersist
	void postPersist(TransactionDateChangeRequestEntity entity) {
		EquipmentEntity equipment = entity.getHiringTransactionEntity().getEquipment();
		ContractorEntity supplier = equipment.getContractor();
		ContractorEntity requester = entity.getHiringTransactionEntity().getRequester();

		firebaseMessagingManager.sendMessage(new NotificationDTO("New time extension request",
				String.format("%s requested to extend hiring time for \"%s\"",
						requester.getName()
						, equipment.getName())
				, supplier.getId()
				, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTION_DATE_CHANGE_REQUESTS, entity.getId())));

	}
}
