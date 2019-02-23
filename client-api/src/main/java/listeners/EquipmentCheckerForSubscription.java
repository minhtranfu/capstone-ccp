package listeners;

import daos.SubscriptionDAO;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.SubscriptionEntity;

import java.util.List;

public class EquipmentCheckerForSubscription implements DataChangeSubscriber<EquipmentEntity> {


	@Override
	public void onDataChange(EquipmentEntity equipmentEntity) {

		if (equipmentEntity.getStatus() != EquipmentEntity.Status.AVAILABLE) {
			return;
		}

		// TODO: 2/22/19 check if match any subscription

		SubscriptionDAO subscriptionDAO = new SubscriptionDAO();
		List<SubscriptionEntity> matchedSubscriptions = subscriptionDAO.getMatchedSubscriptions(equipmentEntity);
		for (SubscriptionEntity matchedSubscription : matchedSubscriptions) {
			//todo if match, send notification to the contractors for each matched subscription
			sendNotification(matchedSubscription,matchedSubscription.getContractor());
		}
	}

	private void sendNotification(SubscriptionEntity subscriptionEntity,
								  ContractorEntity contractorEntity) {
		System.out.println(String.format("Subscription id=%s matched for contractor id=%s"
				, subscriptionEntity.getId()
				, contractorEntity.getId()));
	}


}
