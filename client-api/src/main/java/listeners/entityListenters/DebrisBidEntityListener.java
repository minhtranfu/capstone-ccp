package listeners.entityListenters;

import daos.DebrisBidDAO;
import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.DebrisBidEntity;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PostUpdate;

public class DebrisBidEntityListener {
	@Inject
	DebrisBidDAO debrisBidDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	@PostUpdate
	void postUpdate(DebrisBidEntity entity) {
		entity = debrisBidDAO.findByID(entity.getId());
		ContractorEntity supplier = entity.getSupplier();
		ContractorEntity requester = entity.getDebrisPost().getRequester();
		switch (entity.getStatus()) {
			case ACCEPTED:
				firebaseMessagingManager.sendMessage(new NotificationDTO("Bid Accepted",
						String.format("Bid for \"%s\" has been Accepted", entity.getDebrisPost().getTitle())
						, supplier.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));
		}

	}

	@PostPersist
	void postPersist(DebrisBidEntity entity) {
		entity = debrisBidDAO.findByID(entity.getId());
		ContractorEntity supplier = entity.getSupplier();
		ContractorEntity requester = entity.getDebrisPost().getRequester();
		switch (entity.getStatus()) {
			case PENDING:
				firebaseMessagingManager.sendMessage(new NotificationDTO("New Bid",
						String.format("\"%s\" have a new bid from %s", entity.getDebrisPost().getTitle(),supplier.getName())
						, requester.getId()
						, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.DEBRIS_TRANSACTIONS, entity.getId())));
		}

	}
}
