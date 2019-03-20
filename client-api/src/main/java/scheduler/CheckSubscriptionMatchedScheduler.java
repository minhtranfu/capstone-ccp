package scheduler;

import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.SubscriptionDAO;
import dtos.notifications.NotificationDTO;
import dtos.queryResults.MatchedSubscriptionResult;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.SubscriptionEntity;
import managers.FirebaseMessagingManager;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;

@Singleton
public class CheckSubscriptionMatchedScheduler {
	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	FirebaseMessagingManager messagingManager;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	SubscriptionDAO subscriptionDAO;


	@Schedule(hour = "*", minute = "30", second = "0")
//	@Schedule(hour = "*", minute = "*", second = "10")
	public void checkMatchedEquipments() {

		int timeOffset = 30 * 60; // 30 mins
//		int timeOffset = 30 * 60 * 60 * 60; // 30 mins
		System.out.println("CheckSubscriptionMatchedScheduler checking subscriptions");
		List<MatchedSubscriptionResult> matchedSubscriptionResults = equipmentDAO.getMatchedEquipmentForSubscription(timeOffset);
		for (MatchedSubscriptionResult matchedSubscriptionResult : matchedSubscriptionResults) {
			// TODO: 3/14/19 notify to contractor
			sendNotification(matchedSubscriptionResult);
		}
	}

	private void sendNotification(MatchedSubscriptionResult matchedSubscriptionResult) {
		long subscriptionId = matchedSubscriptionResult.getSubscriptionId();
		long equipmentId = matchedSubscriptionResult.getEquipmentId();
		long contractorId = matchedSubscriptionResult.getContractorId();
		System.out.println(String.format("Subscription id=%s matched for contractor id=%s with equipment id=%s"
				, subscriptionId
				, contractorId
				, equipmentId));

		String clickAction = NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.EQUIPMENTS, equipmentId);

		NotificationDTO notificationDTO = new NotificationDTO("Subscribed equipment found!", "We have found the equipment that you're looking for! \n" +
				"id=" + equipmentId
				, contractorId, clickAction);


		messagingManager.sendMessage(notificationDTO);
	}


}
