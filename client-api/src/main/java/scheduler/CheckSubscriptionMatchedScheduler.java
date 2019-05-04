package scheduler;

import daos.ContractorDAO;
import daos.EquipmentDAO;
import daos.SubscriptionDAO;
import daos.SubscriptionMatchedLogDAO;
import dtos.notifications.NotificationDTO;
import dtos.queryResults.MatchedSubscriptionResult;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.SubscriptionEntity;
import entities.SubscriptionMatchedLogEntity;
import managers.FirebaseMessagingManager;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;
import java.util.HashMap;
import java.util.List;
import java.util.logging.Logger;

@Singleton
public class CheckSubscriptionMatchedScheduler {
	public static final Logger LOGGER = Logger.getLogger(CheckSubscriptionMatchedScheduler.class.toString());

	@Inject
	EquipmentDAO equipmentDAO;

	@Inject
	FirebaseMessagingManager messagingManager;

	@Inject
	ContractorDAO contractorDAO;

	@Inject
	SubscriptionDAO subscriptionDAO;

	@Inject
	SubscriptionMatchedLogDAO subscriptionMatchedLogDAO;

	boolean isRunning = false;
	private static final Object LOCK = new Object();

	//	@Schedule(hour = "*", minute = "30", second = "0")
	@Schedule(hour = "*", minute = "*", second = "0/10")
	public void checkMatchedEquipments() {
		if (isRunning) {
			LOGGER.info("isRunning in another THREAD, skip the transaction");
			return;
		}

//		synchronized (LOCK) {
//			isRunning = true;
//		}
//		int timeOffset = 30 * 60; // 30 mins
//		int timeOffset = 2 * 60; // 2 mins
		int timeOffset = 30 * 60 * 60; // 30 hours

		LOGGER.info("CheckSubscriptionMatchedScheduler checking subscriptions");
		//  4/28/19 filter result list remove the notified information
		List<MatchedSubscriptionResult> matchedSubscriptionResults = equipmentDAO.getMatchedEquipmentForSubscription(timeOffset);
		if (matchedSubscriptionResults.isEmpty()) {
			synchronized (LOCK) {
				isRunning = false;
			}
			return;
		}

		LOGGER.info("matchedSubscriptionResults="+matchedSubscriptionResults.toString());
		for (MatchedSubscriptionResult matchedSubscriptionResult : matchedSubscriptionResults) {
			// 3/14/19 notify to contractor
			sendNotification(matchedSubscriptionResult);
			// TODO: 4/28/19 log matched subscription to database
			logMatchedSubscriptionToDatabase(matchedSubscriptionResult);
		}
//		synchronized (LOCK) {
//			isRunning = false;
//		}
	}

	private void logMatchedSubscriptionToDatabase(MatchedSubscriptionResult matchedSubscriptionResult) {
		SubscriptionMatchedLogEntity entity = new SubscriptionMatchedLogEntity();
		entity.setMatchedEquipmentId(matchedSubscriptionResult.getEquipmentId());
		entity.setMatchedSubscriptionId(matchedSubscriptionResult.getSubscriptionId());
		entity.setContractorId(matchedSubscriptionResult.getContractorId());
		subscriptionMatchedLogDAO.persist(entity);
	}


	private void sendNotification(MatchedSubscriptionResult matchedSubscriptionResult) {
		long subscriptionId = matchedSubscriptionResult.getSubscriptionId();
		long equipmentId = matchedSubscriptionResult.getEquipmentId();
		long contractorId = matchedSubscriptionResult.getContractorId();
		LOGGER.info(String.format("Subscription id=%s matched for contractor id=%s with equipment id=%s"
				, subscriptionId
				, contractorId
				, equipmentId));

		String clickAction = NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.EQUIPMENTS, equipmentId);

		NotificationDTO notificationDTO = new NotificationDTO("Subscribed equipment found!",
				String.format("We have found the equipment that you've subscribed for! equipment #%s for subscription #%s", equipmentId,subscriptionId)
				, contractorId, clickAction);


		messagingManager.sendMessage(notificationDTO);
	}


}
