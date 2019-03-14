package daos;

import entities.AvailableTimeRangeEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {


	@PersistenceContext
	EntityManager entityManager;


	private static final String REGEX_ORDERBY_SINGLEITEM = "(\\w+)\\.(asc|desc)($|,)";

	public List<EquipmentEntity> searchEquipment(LocalDate beginDate, LocalDate endDate,
												 long equipmentTypeId,
												 String orderBy, int offset, int limit) {


		//"select e from EquipmentEntity  e where e.equipmentType.id = :equipmentTypeIdParam and exists (select t from AvailableTimeRangeEntity t where t.equipment.id = e.id  and  t.beginDate <= :curBeginDate and  :curEndDate <= t.endDate)"
		//and not exists (select a from HiringTransactionEntity a where a.equipment.id = e.id and a.status in ('PROCESSING','ACCEPTED') and not (a.endDate < :curBeginDate or a.beginDate>:curEndDate))

		//cant use something like 'from e.availableTimeRanges' because of the lack of flexibility of jpa criteria query


		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EquipmentEntity> query = criteriaBuilder.createQuery(EquipmentEntity.class);


		Root<EquipmentEntity> e = query.from(EquipmentEntity.class);

		Subquery<AvailableTimeRangeEntity> subQuery = query.subquery(AvailableTimeRangeEntity.class);
		Root<AvailableTimeRangeEntity> t = subQuery.from(AvailableTimeRangeEntity.class);

		Subquery<HiringTransactionEntity> subQueryActiveTransaction = query.subquery(HiringTransactionEntity.class);
		Root<HiringTransactionEntity> a = subQueryActiveTransaction.from(HiringTransactionEntity.class);

		ParameterExpression<LocalDate> beginDateParam = criteriaBuilder.parameter(LocalDate.class);
		ParameterExpression<LocalDate> endDateParam = criteriaBuilder.parameter(LocalDate.class);
		ParameterExpression<Long> equipmentTypeIdParam = criteriaBuilder.parameter(Long.class);



//		select equipment available in current timerange
		List<Predicate> whereClauses = new ArrayList<>();
		whereClauses.add(criteriaBuilder.equal(t.get("equipment").get("id"), e.get("id")));

		// this shit by no means be done in another way, fucking retarded jpa
		if (beginDate != null) {
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));

		}
		if (endDate != null) {
			whereClauses.add(criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
		}
		subQuery.select(t).where(whereClauses.toArray(new Predicate[0]));

		/*Select not exist active transactions intersect current timerange*/
		List<Predicate> subQueryActiveWhereClauses = new ArrayList<>();
		subQueryActiveWhereClauses.add(criteriaBuilder.equal(a.get("equipment").get("id"), e.get("id")));
		subQueryActiveWhereClauses.add(a.get("status").in(HiringTransactionEntity.Status.PROCESSING, HiringTransactionEntity.Status.ACCEPTED));


		subQueryActiveWhereClauses.add(
				criteriaBuilder.not(
						criteriaBuilder.or(
								beginDate != null ? criteriaBuilder.lessThan(a.get("endDate"), beginDateParam) : criteriaBuilder.conjunction()
								, endDate != null ? criteriaBuilder.greaterThan(a.get("beginDate"), endDateParam) : criteriaBuilder.conjunction()
						)));
		subQueryActiveTransaction.select(a).where(subQueryActiveWhereClauses.toArray(new Predicate[0]));


//		merge 3 main where clauses
		query.select(e).where(
				equipmentTypeId != 0 ? criteriaBuilder.equal(equipmentTypeIdParam, e.get("equipmentType").get("id")) : criteriaBuilder.conjunction()
				,criteriaBuilder.exists(subQuery)
				,criteriaBuilder.not(criteriaBuilder.exists(subQueryActiveTransaction))
		);

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

		if (equipmentTypeId > 0) {
			typeQuery.setParameter(equipmentTypeIdParam, equipmentTypeId);

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


	//validate if the equipment is available in this time range
	public boolean validateEquipmentAvailable(long equipmentId, LocalDate beginDate, LocalDate endDate) {


		// TODO: 2/11/19 validate user's available time
		//check if there are any available time range that contain this timerange
		//if yes then it's good to go
		List<AvailableTimeRangeEntity> resultList = entityManager
				.createNamedQuery("AvailableTimeRangeEntity.searchTimeRangeInDate", AvailableTimeRangeEntity.class)
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
		List timeRangeIntersectingWithList = entityManager.createNamedQuery("HiringTransactionEntity.getRentingTimeRangeIntersectingWith")
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();

		if (timeRangeIntersectingWithList.size() > 0) {
			return false;
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


	public boolean checkIsIntersect(LocalDate beginDate1, LocalDate endDate1, LocalDate beginDate2, LocalDate endDate2) {
		//validate begindate < enddate

		return !(endDate2.isBefore(beginDate1) || beginDate2.isAfter(endDate1));
	}








	public List<EquipmentEntity> getOverdateRentingEquipments() {
		List<EquipmentEntity> resultList = entityManager.createNamedQuery("EquipmentEntity.getOverdateRenting", EquipmentEntity.class)
				.getResultList();

		return resultList;
	}

	public void changeAllStatusToWaitingForReturning(List<EquipmentEntity> overdateRentingEquipments) {
		for (EquipmentEntity equipmentEntity : overdateRentingEquipments) {
			equipmentEntity.setStatus(EquipmentEntity.Status.WAITING_FOR_RETURNING);
			entityManager.merge(equipmentEntity);
		}
	}


}

// TODO: 2/22/19 make the dao singleton for a publisher pattern !

