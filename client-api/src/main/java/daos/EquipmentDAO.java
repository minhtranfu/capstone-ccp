package daos;

import entities.EquipmentEntity;
import utils.DBUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {
	private static Logger logger = Logger.getLogger(EquipmentDAO.class.toString());



	private static EquipmentDAO instance;
	private static Object LOCK = new Object();

	public List<EquipmentEntity> searchEquipment(Date beginDate, Date endDate) {
		EntityManager entityManager = DBUtils.getEntityManager();
		List<EquipmentEntity> resultList = entityManager
				.createNamedQuery("EquipmentEntity.searchEquipment", EquipmentEntity.class)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();

		return resultList;

	}

	public static EquipmentDAO getInstance() {
		synchronized (LOCK) {
			if (instance == null) {
				instance = new EquipmentDAO();
			}
		}
		return instance;
	}


	public boolean validateEquipmentAvailable(long equipmentId, Date beginDate, Date endDate) {

		// TODO: 1/30/19 validate this

		
		// TODO: 2/11/19 validate user's available time


		// TODO: 2/11/19 check renting time
		return true;
	}

}
