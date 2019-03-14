package listeners.entityListenters;

import entities.SubscriptionEntity;

import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;
import javax.ws.rs.BadRequestException;

public class SubscriptionEntityListener {
	@PrePersist
	void prePersist(SubscriptionEntity subscriptionEntity) {
		// TODO: 3/14/19 validate subscription entity
		validateEntity(subscriptionEntity);

	}

	private void validateEntity(SubscriptionEntity subscriptionEntity) {
		if (subscriptionEntity.getMaxDistance() != null) {
			if (subscriptionEntity.getLatitude() == null || subscriptionEntity.getLongitude() == null) {
				throw new BadRequestException("Long or lat must not null if set maxDistance");
			}
		}

		if (subscriptionEntity.getBeginDate() != null && subscriptionEntity.getEndDate() != null
				&& subscriptionEntity.getBeginDate().isAfter(subscriptionEntity.getEndDate())) {
			throw new BadRequestException("beginDate must not after endDate");
		}

	}

	@PreUpdate
	void preUpdate(SubscriptionEntity subscriptionEntity) {
		validateEntity(subscriptionEntity);
	}

	@PreRemove
	void preRemove(SubscriptionEntity subscriptionEntity) {
	}


}
