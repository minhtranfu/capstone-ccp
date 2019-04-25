package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.HiringTransactionEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class HiringTransactionDAO extends BaseDAO<HiringTransactionEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;

	public GETListResponse<HiringTransactionEntity> getHiringTransactionsBySupplierId(long supplierId, HiringTransactionEntity.Status status, int limit, int offset, String orderBy) {

		//select e from HiringTransactionEntity  e where e.equipment.contractor.id = :supplierId
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<HiringTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(HiringTransactionEntity.class);

		Root<HiringTransactionEntity> e = countQuery.from(HiringTransactionEntity.class);
		criteriaQuery.from(HiringTransactionEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<HiringTransactionEntity.Status> statusParam = criteriaBuilder.parameter(HiringTransactionEntity.Status.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("equipment").get("contractor").get("id"), supplierIdParam)
				, status != null ? criteriaBuilder.equal(e.get("status"), statusParam) : criteriaBuilder.conjunction());

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

		TypedQuery<HiringTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<HiringTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);
	}

	public List<HiringTransactionEntity> getNamedHiringTransactionsBySupplierId(long supplierId, int limit, int offset) {

		//select e from HiringTransactionEntity  e where e.equipment.contractor.id = :supplierId
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionBySupplierId", HiringTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	public GETListResponse<HiringTransactionEntity> getHiringTransactionsByRequesterId(long requesterId, HiringTransactionEntity.Status status, int limit, int offset, String orderBy) {
		//select e from HiringTransactionEntity  e where e.requester.id = :requesterId
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<HiringTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(HiringTransactionEntity.class);

		Root<HiringTransactionEntity> e = countQuery.from(HiringTransactionEntity.class);
		criteriaQuery.from(HiringTransactionEntity.class);


		ParameterExpression<Long> requesterIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<HiringTransactionEntity.Status> statusParam = criteriaBuilder.parameter(HiringTransactionEntity.Status.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("requester").get("id"), requesterIdParam)
				, status != null ? criteriaBuilder.equal(e.get("status"), statusParam) : criteriaBuilder.conjunction());

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(requesterIdParam, requesterId);


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

		TypedQuery<HiringTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(requesterIdParam, requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<HiringTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);
	}
	public List<HiringTransactionEntity> getNamedHiringTransactionsByRequesterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getTransactionsByRequesterId", HiringTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	/* There's no PROCESSING transaction related to this equipment*/
	public List<HiringTransactionEntity> getProcessingTransactionsByEquipmentId(long equipmentId) {

		List<HiringTransactionEntity> hiringTransactionEntities = entityManager.createNamedQuery("HiringTransactionEntity.getProcessingTransactionsByEquipmentId", HiringTransactionEntity.class)
				.setParameter("equipmentId", equipmentId)
				.getResultList();

		return hiringTransactionEntities;

	}

	public List<HiringTransactionEntity> getPendingTransactionIntersectingWith(long equipmentId, LocalDate beginDate, LocalDate endDate) {
		return entityManager.createNamedQuery("HiringTransactionEntity.getPendingTransactionIntersectingWith", HiringTransactionEntity.class)
				.setParameter("equipmentId", equipmentId)
				.setParameter("curBeginDate", beginDate)
				.setParameter("curEndDate", endDate)
				.getResultList();
	}


	public int denyAllPendingTransaction(long equipmentEntityId) {

		int rows = entityManager.createNativeQuery("update hiring_transaction set status = 'DENIED' where equipment_id = :equipmentId and status = 'PENDING'")
				.setParameter("equipmentId", equipmentEntityId)
				.executeUpdate();
		return rows;
	}

}
