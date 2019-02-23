package listeners;

import entities.EquipmentEntity;
import entities.HiringTransactionEntity;

import java.util.Date;

//singleton for better stability and also this task is not that urgent for asynchronous
public class CheckerForRentingStatus implements DataChangeSubscriber<EquipmentEntity> {

	private CheckerForRentingStatus() {
	}
	private static CheckerForRentingStatus instance;
	public static final CheckerForRentingStatus getInstance() {
		if (instance == null) {
			instance = new CheckerForRentingStatus();

		}
		return instance;
	}

	@Override
	public void onDataChange(EquipmentEntity equipmentEntity) {


		if (isOverdate(equipmentEntity)) {
			// TODO: 2/22/19 notify if it does
			onOverdate(equipmentEntity);

		}
	}

	private boolean isOverdate(EquipmentEntity equipmentEntity) {
		if (equipmentEntity.getStatus() != EquipmentEntity.Status.RENTING) {
			return false;
		}
		Date today = new Date();
		if (equipmentEntity.getProcessingHiringTransaction()
				.getEndDate().before(today)) {
			// today must <= endDate to
			return true;
		}
		return false;
	}

	private void onOverdate(EquipmentEntity equipmentEntity) {
		System.out.println(String.format("equipment id=%d is overdate", equipmentEntity));
	}


}
