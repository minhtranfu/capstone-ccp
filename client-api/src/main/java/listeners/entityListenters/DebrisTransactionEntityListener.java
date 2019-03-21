package listeners.entityListenters;

import daos.DebrisBidDAO;
import daos.DebrisPostDAO;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisTransactionEntity;

import javax.inject.Inject;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

public class DebrisTransactionEntityListener {

	@Inject
	DebrisPostDAO debrisPostDAO;

	@Inject
	DebrisBidDAO debrisBidDAO;

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
}
