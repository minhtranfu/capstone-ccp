package scheduler;

import daos.EquipmentDAO;
import entities.EquipmentEntity;

import javax.ejb.Schedule;
import javax.ejb.Singleton;
import javax.inject.Inject;
import java.util.List;

@Singleton
public class CheckStatusScheduler {

	@Inject
	EquipmentDAO equipmentDAO;

	@Schedule(hour = "5", minute = "0", second = "0")
	public void checkRentingStatus() {
		System.out.println("CHECKING RENTING STATUS");


		// get overdate renting transaction list ( or equipment list)

		List<EquipmentEntity> overdateRentingEquipment = equipmentDAO.getOverdateRentingEquipments();
		// TODO: 2/28/19 notify all overdated list


			// chanege satatus of all equipment
		equipmentDAO.changeAllStatusToWaitingForReturning(overdateRentingEquipment);

	}





}
