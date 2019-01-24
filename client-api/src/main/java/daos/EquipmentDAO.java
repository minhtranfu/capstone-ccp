package daos;

import entities.EquipmentEntity;

import java.util.logging.Logger;

public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {
	private static Logger logger = Logger.getLogger(EquipmentDAO.class.toString());



	private static EquipmentDAO instance;
	private static Object LOCK = new Object();

	public static EquipmentDAO getInstance() {
		synchronized (LOCK) {
			if (instance == null) {
				instance = new EquipmentDAO();
			}
		}
		return new EquipmentDAO();
	}


}
