package daos;

import entities.AvailableTimeRangeEntity;
import entities.EquipmentEntity;
import utils.CommonUtils;
import utils.DBUtils;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {
	private static Logger logger = Logger.getLogger(EquipmentDAO.class.toString());


	private static EquipmentDAO instance;
	private static Object LOCK = new Object();

	public List<EquipmentEntity> searchEquipment(Date beginDate, Date endDate) {


//"select e from EquipmentEntity  e where exists (select t from e.availableTimeRanges t where t.beginDate <= :curBeginDate and :curBeginDate <= :curEndDate  and  :curEndDate <= t.endDate)"

		EntityManager entityManager = DBUtils.getEntityManager();
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EquipmentEntity> query = criteriaBuilder.createQuery(EquipmentEntity.class);

		Root<EquipmentEntity> e = query.from(EquipmentEntity.class);
		Join<EquipmentEntity, AvailableTimeRangeEntity> t = e.join("availableTimeRanges", JoinType.LEFT);

		ParameterExpression<Date> beginDateParam = criteriaBuilder.parameter(Date.class);
		ParameterExpression<Date> endDateParam = criteriaBuilder.parameter(Date.class);

		query.select(e);
		List<Predicate> whereClauses = new ArrayList<>();

		Predicate finalPredicate = criteriaBuilder.conjunction();


		// this shit by no means be done in another way, fucking retarded jpa 
		if (beginDate != null) {

//			finalPredicate = criteriaBuilder.and(finalPredicate,criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));
		}
		if (endDate != null) {
//			finalPredicate = criteriaBuilder.and(finalPredicate, criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));

		}


		query.where(whereClauses.toArray(new Predicate[0]));


		TypedQuery<EquipmentEntity> typeQuery = entityManager.createQuery(query);
		if (beginDate != null) {
			typeQuery.setParameter(beginDateParam, beginDate);
		}
		if (endDate != null) {
			typeQuery.setParameter(endDateParam, endDate);
		}
		List<EquipmentEntity> resultList = typeQuery.getResultList();


//		List<EquipmentEntity> resultList = entityManager
//				.createNamedQuery("EquipmentEntity.searchEquipment", EquipmentEntity.class)
//				.setParameter("curBeginDate", beginDate)
//				.setParameter("curEndDate", endDate)
//				.getResultList();

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
		if (count <= 1) {
			return true;
		}
		for (int i = 0; i < count - 1; i++) {
			for (int j = i + 1; j < count; j++) {
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
