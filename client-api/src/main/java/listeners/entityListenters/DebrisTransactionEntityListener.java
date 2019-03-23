package listeners.entityListenters;

import daos.DebrisBidDAO;
import daos.DebrisPostDAO;
import daos.DebrisTransactionDAO;
import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisTransactionEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

public class DebrisTransactionEntityListener {

	@Inject
	DebrisPostDAO debrisPostDAO;

	@Inject
	DebrisBidDAO debrisBidDAO;

	@Inject
	DebrisTransactionDAO debrisTransactionDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	private void setRequesterSupplier(DebrisTransactionEntity entity) {

		// TODO: 3/21/19 validate
		DebrisBidEntity managedBid = debrisBidDAO.findByIdWithValidation(entity.getDebrisBid().getId());
		DebrisPostEntity managedPost = debrisPostDAO.findByIdWithValidation(entity.getDebrisPost().getId());


		entity.setRequester(managedPost.getRequester());
		entity.setSupplier(managedBid.getSupplier());
		entity.setPrice(managedBid.getPrice());

		entity.setStatus(DebrisTransactionEntity.Status.ACCEPTED);
	}

	@PrePersist
	void prePersist(DebrisTransactionEntity entity) {

		setRequesterSupplier(entity);

	}

	@PreUpdate
	void preUpdate(DebrisTransactionEntity entity) {
		if (entity.getStatus() == DebrisTransactionEntity.Status.ACCEPTED) {
			setRequesterSupplier(entity);
		}
	}


	@PostUpdate
	void postUpdate(DebrisTransactionEntity entity) {
		entity = debrisTransactionDAO.findByID(entity.getId());
		System.out.println(String.format("PostUpdate, entity=%s", entity));

		//  notify receiver about hiring trasnction changed

		ContractorEntity requester = entity.getRequester();
		ContractorEntity supplier = entity.getSupplier();

		switch (entity.getStatus()) {
			case ACCEPTED:
				//already done in DebrisPost & DebrisBid ACCEPTED
				break;
			case DELIVERING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Delivering debris service!",
						String.format("The debris service for \"%s\" is delivering by %s",
								entity.getDebrisPost().getTitle()
								, supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));

				break;
			case WORKING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Working on debris service!",
						String.format("The debris service for \"%s\" is being worked on by %s",
								entity.getDebrisPost().getTitle()
								, supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS,
						entity.getId())));

				break;
			case FINISHED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Debris service Finished!",
						String.format("\"%s\" have been confirmed FINISHED ",
								entity.getDebrisPost().getTitle())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));
				firebaseMessagingManager.sendMessage(new NotificationDTO("Debris service Finished!",
						String.format("\"%s\" have been confirmed FINISHED ",
								entity.getDebrisPost().getTitle())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));

				break;
			case CANCELED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Debris service Canceled",
						String.format("Debris service for \"%s\" has been canceled", entity.getDebrisPost().getTitle())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));
				firebaseMessagingManager.sendMessage(new NotificationDTO("Debris service Canceled",
						String.format("Debris service for \"%s\" has been canceled", entity.getDebrisPost().getTitle())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));

				break;
		}
	}

	@PostPersist
	void postPersist(DebrisTransactionEntity entity) {
		//already done in DebrisPost & DebrisBid ACCEPTED
	}
}
