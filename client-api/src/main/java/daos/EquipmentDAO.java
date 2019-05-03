package daos;

import dtos.notifications.NotificationDTO;
import dtos.queryResults.MatchedSubscriptionResult;
import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.*;
import managers.ElasticSearchManager;
import managers.FirebaseMessagingManager;
import org.apache.commons.lang3.StringUtils;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import javax.ws.rs.InternalServerErrorException;
import java.util.ArrayList;
import java.time.LocalDate;
import java.util.List;
import java.util.logging.Logger;

@Stateless
public class EquipmentDAO extends BaseDAO<EquipmentEntity, Long> {
	private static final Logger LOGGER = Logger.getLogger(EquipmentDAO.class.toString());


	@PersistenceContext
	EntityManager entityManager;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;

	@Inject
	ElasticSearchManager elasticSearchManager;

	public List<EquipmentEntity> searchEquipment(String query, LocalDate beginDate, LocalDate endDate,
												 Double latitude, Double longitude, Double maxDistance, Long contractorId, Long equipmentTypeId,
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


		ParameterExpression<Double> curLatParam = criteriaBuilder.parameter(Double.class);
		ParameterExpression<Double> curLongParam = criteriaBuilder.parameter(Double.class);
		ParameterExpression<Double> maxDistanceParam = criteriaBuilder.parameter(Double.class);

//		select equipment available in current timerange
		List<Predicate> whereClausesTimeRangeSubQuery = new ArrayList<>();
		whereClausesTimeRangeSubQuery.add(criteriaBuilder.equal(t.get("equipment").get("id"), e.get("id")));

		// this shit by no means be done in another way, fucking retarded jpa
		if (beginDate != null) {
			whereClausesTimeRangeSubQuery.add(criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));

		}
		if (endDate != null) {
			whereClausesTimeRangeSubQuery.add(criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
		}

		Predicate distanceWhereClause;
		if (latitude != null && longitude != null && maxDistance != null) {
			distanceWhereClause = criteriaBuilder
					.lessThan(
							criteriaBuilder.function("calcDistance"
									, Double.class, e.get("construction").get("latitude"), e.get("construction").get("longitude")
									, curLatParam, curLongParam)
							, maxDistanceParam);
		} else {
			distanceWhereClause = criteriaBuilder.conjunction();
		}


		subQuery.select(t).where(whereClausesTimeRangeSubQuery.toArray(new Predicate[0]));

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
				equipmentTypeId != null && equipmentTypeId>0 ? criteriaBuilder.equal(equipmentTypeIdParam, e.get("equipmentType").get("id")) : criteriaBuilder.conjunction()
				, contractorId != null ? criteriaBuilder.notEqual(e.get("contractor").get("id"), contractorParam) : criteriaBuilder.conjunction()
				, criteriaBuilder.exists(subQuery)
				, criteriaBuilder.not(criteriaBuilder.exists(subQueryActiveTransaction))
				//distance query
				, distanceWhereClause
				//excluded deleted equipments
				, criteriaBuilder.equal(e.get("deleted"), false)
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

		if (equipmentTypeId!=null && equipmentTypeId > 0) {
			typeQuery.setParameter(equipmentTypeIdParam, equipmentTypeId);

		}

		if (latitude != null && longitude != null && maxDistance != null) {
			typeQuery.setParameter(curLatParam, latitude);
			typeQuery.setParameter(curLongParam, longitude);
			typeQuery.setParameter(maxDistanceParam, maxDistance);
		}

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);


		return typeQuery.getResultList();

	}


	public List<EquipmentEntity> searchEquipmentByElasticSearch(String query, LocalDate beginDate, LocalDate endDate,
																Double latitude, Double longitude, Double maxDistance, Long contractorId, Long equipmentTypeId,
																String orderBy, int offset, int limit) {
		List<Long> idList = elasticSearchManager.searchEquipment(query, contractorId, equipmentTypeId, orderBy);
		String idListString = StringUtils.join(idList.toArray(new Long[0]), ",");
		LOGGER.info("idListString="+idListString);
		if (idList.isEmpty()) {
			return new ArrayList<EquipmentEntity>();
		}

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<EquipmentEntity> criteriaQuery = criteriaBuilder.createQuery(EquipmentEntity.class);


		Root<EquipmentEntity> e = criteriaQuery.from(EquipmentEntity.class);

		Subquery<AvailableTimeRangeEntity> subQuery = criteriaQuery.subquery(AvailableTimeRangeEntity.class);
		Root<AvailableTimeRangeEntity> t = subQuery.from(AvailableTimeRangeEntity.class);

		Subquery<HiringTransactionEntity> subQueryActiveTransaction = criteriaQuery.subquery(HiringTransactionEntity.class);
		Root<HiringTransactionEntity> a = subQueryActiveTransaction.from(HiringTransactionEntity.class);


		ParameterExpression<LocalDate> beginDateParam = criteriaBuilder.parameter(LocalDate.class, "beginDateParam");
		ParameterExpression<LocalDate> endDateParam = criteriaBuilder.parameter(LocalDate.class, "endDateParam");

		ParameterExpression<List> idListParam = criteriaBuilder.parameter(List.class, "idListParam");


		ParameterExpression<Double> curLatParam = criteriaBuilder.parameter(Double.class, "curLatParam");
		ParameterExpression<Double> curLongParam = criteriaBuilder.parameter(Double.class, "curLongParam");
		ParameterExpression<Double> maxDistanceParam = criteriaBuilder.parameter(Double.class, "maxDistanceParam");
		ParameterExpression<String> idListStringParam = criteriaBuilder.parameter(String.class);

//		select equipment available in current timerange
		List<Predicate> whereClausesTimeRangeQuery = new ArrayList<>();
		whereClausesTimeRangeQuery.add(criteriaBuilder.equal(t.get("equipment").get("id"), e.get("id")));

		// this shit by no means be done in another way, fucking retarded jpa
		if (beginDate != null) {
			whereClausesTimeRangeQuery.add(criteriaBuilder.lessThanOrEqualTo(t.get("beginDate"), beginDateParam));

		}
		if (endDate != null) {
			whereClausesTimeRangeQuery.add(criteriaBuilder.lessThanOrEqualTo(endDateParam, t.get("endDate")));
		}

		Predicate distanceWhereClause;
		if (latitude != null && longitude != null && maxDistance != null) {
			distanceWhereClause = criteriaBuilder
					.lessThan(
							criteriaBuilder.function("calcDistance"
									, Double.class, e.get("construction").get("latitude"), e.get("construction").get("longitude")
									, curLatParam, curLongParam)
							, maxDistanceParam);
		} else {
			distanceWhereClause = criteriaBuilder.conjunction();
		}


		subQuery.select(t).where(whereClausesTimeRangeQuery.toArray(new Predicate[0]));

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
				criteriaBuilder.exists(subQuery)
				, criteriaBuilder.not(criteriaBuilder.exists(subQueryActiveTransaction))
				//distance
				, distanceWhereClause
				, e.get("id").in(idListParam)
		);


		Order orderByIdListOrder = criteriaBuilder.asc(criteriaBuilder
				.function("find_in_set", Long.class, e.get("id"), idListStringParam));
		criteriaQuery.orderBy(orderByIdListOrder);

//		if (!orderBy.isEmpty()) {
//			List<Order> orderList = new ArrayList<>();
//			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
//				if (orderByWrapper.isAscending()) {
//					orderList.add(criteriaBuilder.asc(e.get(orderByWrapper.getColumnName())));
//				} else {
//					orderList.add(criteriaBuilder.desc(e.get(orderByWrapper.getColumnName())));
//				}
//			}
//			criteriaQuery.orderBy(orderList);
//		}c

		TypedQuery<EquipmentEntity> typeQuery = entityManager.createQuery(criteriaQuery);

		if (beginDate != null) {
			typeQuery.setParameter(beginDateParam, beginDate);
		}
		if (endDate != null) {
			typeQuery.setParameter(endDateParam, endDate);
		}


		if (latitude != null && longitude != null && maxDistance != null) {
			typeQuery.setParameter(curLatParam, latitude);
			typeQuery.setParameter(curLongParam, longitude);
			typeQuery.setParameter(maxDistanceParam, maxDistance);
		}


		//set equipment list
		typeQuery.setParameter(idListParam, idList);
		typeQuery.setParameter(idListStringParam, idListString);
		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);

		List<EquipmentEntity> resultList = typeQuery.getResultList();
		// TODO: 4/28/19 sort result list by id
//		ArrayList<EquipmentEntity> sortedResultList = new ArrayList<>();
//		for (Long id : idList) {
//			try {
//				sortedResultList.add(resultList.stream().filter(entity -> entity.getId() == id).findAny()
//						.orElseThrow(InternalServerErrorException::new));
//			} catch (InternalServerErrorException e1) {
////				e1.printStackTrace();
////				LOGGER.info("searchEquipmentByElasticSearch(), equipment id=%s is filtered");
//				// simply dont add it =="
//			}
//		}
		return resultList;


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
					, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, processingHiringTransaction.getId())));

			//to requester
			firebaseMessagingManager.sendMessage(new NotificationDTO("Renting time ended",
					String.format("Your renting time for \"%s\" has finished. It's time to return it to %s", managedEquipment.getName(), supplier.getName())
					, supplier.getId()
					, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.HIRING_TRANSACTIONS, processingHiringTransaction.getId())));

		}
	}

	public List<MatchedSubscriptionResult> getMatchedEquipmentForSubscription(int timeOffset) {
		return entityManager.createNamedQuery("EquipmentEntity.getMatchedEquipmentForSubscriptions", MatchedSubscriptionResult.class)
				.setParameter("timeOffset", timeOffset)
				.getResultList();

	}

	public GETListResponse<EquipmentEntity> getEquipmentsBySupplierId(long supplierId, EquipmentEntity.Status status, int limit, int offset, String orderBy) {


		//select  e from EquipmentEntity  e where e.contractor.id = :supplierId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<EquipmentEntity> criteriaQuery = criteriaBuilder.createQuery(EquipmentEntity.class);

		Root<EquipmentEntity> e = countQuery.from(EquipmentEntity.class);
		criteriaQuery.from(EquipmentEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<EquipmentEntity.Status> statusParam = criteriaBuilder.parameter(EquipmentEntity.Status.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("contractor").get("id"), supplierIdParam)
				, status != null ? criteriaBuilder.equal(e.get("status"), statusParam) : criteriaBuilder.conjunction()
				//is_deleted = 0
				, criteriaBuilder.equal(e.get("deleted"), false)
		);

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(supplierIdParam, supplierId);


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

		TypedQuery<EquipmentEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<EquipmentEntity> equipmentEntities = listTypedQuery.getResultList();

		return new GETListResponse<EquipmentEntity>(itemCount, limit, offset, orderBy, equipmentEntities);

	}

	public List<EquipmentEntity> getEquipmentsByEquipmentTypeIdForTraining(long equipmentTypeId, boolean includeDeleted) {
		String query = "select e from EquipmentEntity e where e.equipmentType.id = :equipmentTypeId and e.additionalSpecsValues.size > 0 ";
		if (!includeDeleted) {
			query += " and e.deleted=false ";
		}
		return entityManager.createQuery(query
				, EquipmentEntity.class)
				.setParameter("equipmentTypeId", equipmentTypeId)
				.getResultList();

	}


}


