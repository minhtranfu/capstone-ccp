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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {
	private static Logger logger = Logger.getLogger(EquipmentDAO.class.toString());


	private static EquipmentDAO instance;
	private static Object LOCK = new Object();


	private static final String REGEX_ORDERBY_SINGLEITEM = "(\\w+)\\.(asc|desc)($|,)";
	public List<EquipmentEntity> searchEquipment(Date beginDate, Date endDate, String orderBy, int offset, int limit) {


		//"select e from EquipmentEntity  e where exists (select t from AvailableTimeRangeEntity t where t.equipment.id = e.id  and  t.beginDate <= :curBeginDate and  :curEndDate <= t.endDate)"

		//cant use something like 'from e.availableTimeRanges' because of the lack of flexibility of jpa criteria query


		EntityManager entityManager = DBUtils.getEntityManager();
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EquipmentEntity> query = criteriaBuilder.createQuery(EquipmentEntity.class);


		Root<EquipmentEntity> e = query.from(EquipmentEntity.class);

		Subquery<AvailableTimeRangeEntity> subQuery = query.subquery(AvailableTimeRangeEntity.class);
		Root<AvailableTimeRangeEntity> t = subQuery.from(AvailableTimeRangeEntity.class);


		ParameterExpression<Date> beginDateParam = criteriaBuilder.parameter(Date.class);
		ParameterExpression<Date> endDateParam = criteriaBuilder.parameter(Date.class);

		List<Predicate> whereClauses = new ArrayList<>();

		whereClauses.add(criteriaBuilder.equal(t.get("equipment").get("id"), e.get("id")));
//		Predicate finalPredicate = criteriaBuilder.conjunction();


		// this shit by no means be done in another way, fucking retarded jpa
		if (beginDate != null) {
//			finalPredicate = criteriaBuilder.and(finalPredicate,criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));
		}
		if (endDate != null) {
//			finalPredicate = criteriaBuilder.and(finalPredicate, criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
		}


		subQuery.select(t).where(whereClauses.toArray(new Predicate[0]));

		query.select(e).where(criteriaBuilder.exists(subQuery));


		if (!orderBy.isEmpty()) {
			List<Order> orderList = new ArrayList<>();

			// TODO: 2/14/19 string split to orderBy list
			Pattern pattern = Pattern.compile(REGEX_ORDERBY_SINGLEITEM);

			Matcher matcher = pattern.matcher(orderBy);
			while (matcher.find()) {
				String orderBySingleItem = orderBy.substring(matcher.start(), matcher.end());


				String columnName = matcher.group(1);
				String orderKeyword = matcher.group(2);

				if (orderKeyword.equals("desc")) {
					orderList.add(criteriaBuilder.desc(e.get(columnName)));
				} else {
					orderList.add(criteriaBuilder.asc(e.get(columnName)));

				}
			}


			query.orderBy(orderList);
		}

		TypedQuery<EquipmentEntity> typeQuery = entityManager.createQuery(query);

		if (beginDate != null) {
			typeQuery.setParameter(beginDateParam, beginDate);
		}
		if (endDate != null) {
			typeQuery.setParameter(endDateParam, endDate);
		}

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);


//		List<EquipmentEntity> resultList = entityManager
//				.createNamedQuery("EquipmentEntity.searchEquipment", EquipmentEntity.class)
//				.setParameter("curBeginDate", beginDate)
//				.setParameter("curEndDate", endDate)
//				.getResultList();

		return typeQuery.getResultList();

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
