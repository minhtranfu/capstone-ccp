package listeners;

import daos.EquipmentDAO;
import entities.EquipmentEntity;
import listeners.events.EquipmentDataChangedEvent;

import javax.ejb.Stateless;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.SessionScoped;
import javax.enterprise.event.Observes;
import javax.inject.Inject;
import java.awt.*;
import java.time.LocalDate;

//should be  singleton for better stability and also this task is not that urgent for asynchronous
@Stateless
public class CheckerForRentingStatus{

	public CheckerForRentingStatus() {
	}


	@Inject
	EquipmentDAO equipmentDAO;

	public void onDataChange(@Observes EquipmentDataChangedEvent equipmentDataChangedEvent) {

		System.out.println(String.format("CHECKER receieved equipment id=%s", equipmentDataChangedEvent.getEquipmentEntity().getId()));
		EquipmentEntity equipmentEntity = equipmentDataChangedEvent.getEquipmentEntity();

		if (isOverdate(equipmentEntity)) {
			// TODO: 2/22/19 notify if it is
			onOverdate(equipmentEntity);

		}
	}

	private boolean isOverdate(EquipmentEntity equipmentEntity) {

		if (equipmentEntity.getStatus() != EquipmentEntity.Status.RENTING) {
			return false;
		}
		LocalDate today = LocalDate.now();
		if (equipmentEntity.getProcessingHiringTransaction()
				.getEndDate().isBefore(today)) {
			// today must <= endDate to
			return true;
		}
		return false;
	}

	private void onOverdate(EquipmentEntity equipmentEntity) {
		System.out.println(String.format("CHECKER equipment id=%d is overdate, changing to WAITING_FOR_RETURNING", equipmentEntity.getId()));

		// TODO: 2/28/19 change status to waiting_for_returning
		equipmentEntity.setStatus(EquipmentEntity.Status.WAITING_FOR_RETURNING);
		equipmentDAO.merge(equipmentEntity);
	}


}
