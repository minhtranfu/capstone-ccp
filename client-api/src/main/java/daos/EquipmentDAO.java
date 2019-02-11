package daos;

import entities.AvailableTimeRangeEntity;
import entities.EquipmentEntity;
import utils.CommonUtils;
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


	//validate if the equipment is available in this time range
	public boolean validateEquipmentAvailable(long equipmentId, Date beginDate, Date endDate) {


		EntityManager entityManager = DBUtils.getEntityManager();

		// TODO: 2/11/19 validate user's available time
		//check if there are any available time range that contain this timerange
		//if yes then it's good to go
		List<EquipmentEntity> resultList = entityManager
				.createNamedQuery("AvailableTimeRangeEntity.searchTimeRangeInDate", EquipmentEntity.class)
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();

		if (resultList.size() == 0) {
			return false;
		}


		// TODO: 2/11/19 check renting time
		//check if there are any renting time that INTERSECT with this time range
		//if yes --> BAD
		List timeRangeIntersectingWithList = entityManager.createNamedQuery("HiringTransactionEntity.getTimeRangeIntersectingWith")
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();

		if (timeRangeIntersectingWithList.size() > 0) {
			return false;
		}
		return true;
	}
	

	public boolean validateBeginEndDate(List<AvailableTimeRangeEntity> availableTimeRangeEntities) {
		for (AvailableTimeRangeEntity availableTimeRangeEntity : availableTimeRangeEntities) {
			if (availableTimeRangeEntity.getBeginDate().after(availableTimeRangeEntity.getEndDate())) {
				return false;
			}
		}
		return true;

	}
	//validate that there must be no time range that intersect to another
	public boolean validateNoIntersect(List<AvailableTimeRangeEntity> availableTimeRangeEntities) {
		int count = availableTimeRangeEntities.size();
		if (count <=1) {
			return true;
		}
		for (int i = 0; i < count-1; i++) {
			for (int j = i+1; j < count; j++) {
				AvailableTimeRangeEntity availableTimeRangeEntity1 = availableTimeRangeEntities.get(i);
				AvailableTimeRangeEntity availableTimeRangeEntity2 = availableTimeRangeEntities.get(j);
				if (checkIsIntersect(availableTimeRangeEntity1.getBeginDate(), availableTimeRangeEntity1.getEndDate()
						, availableTimeRangeEntity2.getBeginDate(), availableTimeRangeEntity2.getEndDate())) {
					return false;
				}
			}
		}

		return true;
	}

	public static boolean checkIsIntersect(Date beginDate1, Date endDate1, Date beginDate2, Date endDate2) {
		//validate begindate < enddate

		return !(endDate2.before(beginDate1) || beginDate2.after(endDate1));
	}
}
