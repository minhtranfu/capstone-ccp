package jaxrs.validators;

import entities.SubscriptionEntity;

import javax.ws.rs.BadRequestException;

public class SubscriptionEntityValidator {
	public void validateEntity(SubscriptionEntity subscriptionEntity) {
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
}
