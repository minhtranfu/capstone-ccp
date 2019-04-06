package daos;

import dtos.notifications.NotificationDTO;
import dtos.queryResults.MatchedSubscriptionResult;
import dtos.wrappers.OrderByWrapper;
import entities.AvailableTimeRangeEntity;
import entities.ContractorEntity;
import entities.EquipmentEntity;
import entities.HiringTransactionEntity;
import managers.FirebaseMessagingManager;
import utils.CommonUtils;
import utils.Constants;

import javax.ejb.Stateless;
import javax.inject.Inject;
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

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	public List<EquipmentEntity> searchEquipment(String query, LocalDate beginDate, LocalDate endDate,
												 Long contractorId, long equipmentTypeId,
												 String orderBy, int offset, int limit) {


		//"select e from EquipmentEntity  e where e.equipmentType.id = :equipmentTypeIdParam and exists (select t from AvailableTimeRangeEntity t where t.equipment.id = e.id  and  t.beginDate <= :curBeginDate and  :curEndDate <= t.endDate)"
		//and not exists (select a from HiringTransactionEntity a where a.equipment.id = e.id and a.status in ('PROCESSING','ACCEPTED') and not (a.endDate < :curBeginDate or a.beginDate>:curEndDate))

		//cant use something like 'from e.availableTimeRanges' because of the lack of flexibility of jpa criteria query


		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EquipmentEntity> criteriaQuery = criteriaBuilder.createQuery(EquipmentEntity.class);


		Root<EquipmentEntity> e = criteriaQuery.from(EquipmentEntity.class);

		Subquery<AvailableTimeRangeEntity> subQuery = criteriaQuery.subquery(AvailableTimeRangeEntity.class);
		Root<AvailableTimeRangeEntity> t = subQuery.from(AvailableTimeRangeEntity.class);

		Subquery<HiringTransactionEntity> subQueryActiveTransaction = criteriaQuery.subquery(HiringTransactionEntity.class);
		Root<HiringTransactionEntity> a = subQueryActiveTransaction.from(HiringTransactionEntity.class);


		ParameterExpression<String> queryParam = criteriaBuilder.parameter(String.class);
		ParameterExpression<Long> contractorParam = criteriaBuilder.parameter(Long.class);
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
		criteriaQuery.select(e).where(
				criteriaBuilder.like(e.get("name"), queryParam),
				equipmentTypeId != 0 ? criteriaBuilder.equal(equipmentTypeIdParam, e.get("equipmentType").get("id")) : criteriaBuilder.conjunction()
				, contractorId != null ? criteriaBuilder.notEqual(e.get("contractor").get("id"), contractorParam) : criteriaBuilder.conjunction()
				, criteriaBuilder.exists(subQuery)
				, criteriaBuilder.not(criteriaBuilder.exists(subQueryActiveTransaction))
		);

		if (!orderBy.isEmpty()) {
			List<Order> orderList = new ArrayList<>();
			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
				if (orderByWrapper.isAscending()) {
					orderList.add(criteriaBuilder.asc(e.get(orderByWrapper.getColumnName())));
				} else {
					orderList.add(criteriaBuilder.desc(e.get(orderByWrapper.getColumnName())));
				}
			}
			criteriaQuery.orderBy(orderList);
		}

		TypedQuery<EquipmentEntity> typeQuery = entityManager.createQuery(criteriaQuery);

		typeQuery.setParameter(queryParam, "%" + query + "%");
		if (contractorId != null) {
			typeQuery.setParameter(contractorParam, contractorId);
		}

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
			EquipmentEntity managedEquipment = entityManager.merge(equipmentEntity);

			HiringTransactionEntity processingHiringTransaction = managedEquipment.getProcessingHiringTransactions().get(0);
			ContractorEntity requester = processingHiringTransaction.getRequester();
			ContractorEntity supplier = equipmentEntity.getContractor();

			//notify status changed to WAITING_FOR_RETURNING
			//to supplier
			firebaseMessagingManager.sendMessage(new NotificationDTO("Renting time ended",
					String.format("Renting session of \"%s\" has finished. It's time to receive your equipment from %s"
							, managedEquipment.getName()
							, requester.getName())
					, supplier.getId()
					, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTIONS, processingHiringTransaction.getId())));

			//to requester
			firebaseMessagingManager.sendMessage(new NotificationDTO("Renting time ended",
					String.format("Your renting time for \"%s\" has finished. It's time to return it to %s", managedEquipment.getName(), supplier.getName())
					, supplier.getId()
					, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.TRANSACTIONS, processingHiringTransaction.getId())));

		}
	}

	public List<MatchedSubscriptionResult> getMatchedEquipmentForSubscription(int timeOffset) {
		return entityManager.createNamedQuery("EquipmentEntity.getMatchedEquipmentForSubscriptions", MatchedSubscriptionResult.class)
				.setParameter("timeOffset", timeOffset)
				.getResultList();

	}

}

// TODO: 2/22/19 make the dao singleton for a publisher pattern !

