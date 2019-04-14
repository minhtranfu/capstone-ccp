package listeners.entityListenters;

import daos.ContractorDAO;
import daos.HiringTransactionDAO;
import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

public class HiringTransactionEntityListener {
	@Inject
	ContractorDAO contractorDAO;

	@Inject
	HiringTransactionDAO hiringTransactionDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;


	// use this instead of listening in dao layer because it can detect dupplicaiton and not triggered when nothing chnanged
	@PostUpdate
	void postUpdate(HiringTransactionEntity entity) {
		entity = hiringTransactionDAO.findByID(entity.getId());
		System.out.println(String.format("PostUpdate, entity=%s", entity	));

		// TODO: 3/11/19 notify receiver about hiring trasnction changed
		ContractorEntity requester = entity.getRequester();
		ContractorEntity supplier = entity.getEquipment().getContractor();
		EquipmentEntity equipment = entity.getEquipment();
		switch (entity.getStatus()) {
			case PROCESSING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Equipment Delivering!",
						String.format("Equipment \"%s\" is delivering to you by %s", equipment.getName(), supplier.getName())
						, requester.getId()
						,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));

				break;
			case ACCEPTED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Request accepted",
						String.format("Your request for equipment %s have been accepted", entity.getEquipment().getName())
						, requester.getId()
				,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));
				break;
			case FINISHED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Request finished",
						String.format("You have returned equipment %s to %s", equipment.getName(), supplier.getName())
						, requester.getId()
						,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));

				break;
			case PENDING:
				// do nothing, what do you expect ?
				break;
			case CANCELED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Transaction canceled",
						String.format("Transaction from %s for equipment %s have been canceled", requester.getName(), equipment.getName())
						, supplier.getId()
						,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));
				firebaseMessagingManager.sendMessage(new NotificationDTO("Transaction canceled",
						String.format("Transaction from %s for equipment %s have been canceled", requester.getName(), equipment.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));

				break;
			case DENIED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Request denied",
						String.format("Your request for equipment %s have been denied", entity.getEquipment().getName())
						, requester.getId()
						,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));

				break;
		}
	}

	@PostPersist
	void postPersist(HiringTransactionEntity entity) {
		// TODO: 3/11/19 someone has request this shit
		entity = hiringTransactionDAO.findByID(entity.getId());

		System.out.println(String.format("PostPersist, entity=%s", entity	));

		// TODO: 3/11/19 do this with post from cart
		firebaseMessagingManager.sendMessage(new NotificationDTO("New request",
				String.format("You have new request for equipment %s", entity.getEquipment().getName())
				, entity.getEquipment().getContractor().getId()
				,NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, entity.getId())));

	}
}
