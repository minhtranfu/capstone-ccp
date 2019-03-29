package scheduler;

import daos.EquipmentDAO;
import entities.EquipmentEntity;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;
import java.util.List;
import java.util.logging.Logger;

@Singleton
public class CheckStatusScheduler {

	public static final Logger LOGGER = Logger.getLogger(CheckStatusScheduler.class.toString());

	@Inject
	EquipmentDAO equipmentDAO;

//	@Schedule(hour = "5", minute = "0", second = "0")
	@Schedule(hour = "*", minute = "*", second = "0/4")
	public void checkRentingStatus() {
		LOGGER.info("CHECKING RENTING STATUS");
		// get overdate renting transaction list ( or equipment list)

		List<EquipmentEntity> overdateRentingEquipment = equipmentDAO.getOverdateRentingEquipments();
			// chanege satatus of all equipment
		equipmentDAO.changeAllStatusToWaitingForReturning(overdateRentingEquipment);

	}





}
