package listeners.eventListeners;

import daos.SubscriptionDAO;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.SubscriptionEntity;
import listeners.events.EquipmentDataChangedEvent;
import managers.FirebaseMessagingManager;

import javax.ejb.Stateless;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import java.util.List;

@Stateless
public class EquipmentCheckerForSubscription {

	@Inject
	FirebaseMessagingManager messagingManager;

	@Inject
	SubscriptionDAO subscriptionDAO;


	public void onDataChange(@Observes EquipmentDataChangedEvent equipmentDataChangedEvent) {

		EquipmentEntity equipmentEntity = equipmentDataChangedEvent.getEquipmentEntity();
		System.out.println(String.format("EquipmentCheckerForSubscription  checking equipment id=%d", equipmentEntity.getId()));
		if (equipmentEntity.getStatus() != EquipmentEntity.Status.AVAILABLE) {
			return;
		}

		// TODO: 3/14/19 check if this equipment is notified in history for dupplicate notification whenever equipment changed

		// TODO: 3/14/19 check this equipment not belong to subscription

		// 2/22/19 check if match any subscription
		List<SubscriptionEntity> matchedSubscriptions = subscriptionDAO.getMatchedSubscriptions(equipmentEntity);
		for (SubscriptionEntity matchedSubscription : matchedSubscriptions) {
			//if match, send notification to the contractors for each matched subscription
			sendNotification(equipmentEntity,matchedSubscription,matchedSubscription.getContractor());
		}
	}

	private void sendNotification(
			EquipmentEntity equipmentEntity,
			SubscriptionEntity subscriptionEntity,
			ContractorEntity contractorEntity) {

		messagingManager.sendMessage("Subscribed equipment found!",
				String.format("We have found the equipment that you subscribed for id=%d", equipmentEntity.getId()),
				contractorEntity.getId());

		System.out.println(String.format("Subscription id=%s matched for contractor id=%s"
				, subscriptionEntity.getId()
				, contractorEntity.getId()));
	}


}
