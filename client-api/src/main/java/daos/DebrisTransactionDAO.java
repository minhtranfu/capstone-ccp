package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.DebrisTransactionEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DebrisTransactionDAO extends BaseDAO<DebrisTransactionEntity, Long> {
	public GETListResponse<DebrisTransactionEntity> getDebrisTransactionsBySupplierId(long supplierId, DebrisTransactionEntity.Status status, int limit, int offset, String orderBy) {
//		select t from DebrisTransactionEntity t where t.supplier.id = :supplierId
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisTransactionEntity.class);

		Root<DebrisTransactionEntity> e = countQuery.from(DebrisTransactionEntity.class);
		criteriaQuery.from(DebrisTransactionEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<DebrisTransactionEntity.Status> statusParam = criteriaBuilder.parameter(DebrisTransactionEntity.Status.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("supplier").get("id"), supplierIdParam)
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

		TypedQuery<DebrisTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);

	}
	public List<DebrisTransactionEntity> getNamedDebrisTransactionsBySupplierId(long supplierId,int limit, int offset) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.bySupplier", DebrisTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public List<DebrisTransactionEntity> getNamedDebrisTransactionsByRequesterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisTransactionEntity.byRequester", DebrisTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public GETListResponse<DebrisTransactionEntity> getDebrisTransactionsByRequesterId(long requesterId, DebrisTransactionEntity.Status status, int limit, int offset, String orderBy) {
//		select t from DebrisTransactionEntity t where t.requester.id = :requesterId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisTransactionEntity.class);

		Root<DebrisTransactionEntity> e = countQuery.from(DebrisTransactionEntity.class);
		criteriaQuery.from(DebrisTransactionEntity.class);


		ParameterExpression<Long> requesterIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<DebrisTransactionEntity.Status> statusParam = criteriaBuilder.parameter(DebrisTransactionEntity.Status.class);

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

		TypedQuery<DebrisTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(requesterIdParam, requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);
	}

	public GETListResponse<DebrisTransactionEntity> getDebrisTransactions(Long postId, Long bidId, int limit, int offset, String orderBy) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisTransactionEntity.class);

		Root<DebrisTransactionEntity> e = countQuery.from(DebrisTransactionEntity.class);
		criteriaQuery.from(DebrisTransactionEntity.class);


		ParameterExpression<Long> bidIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<Long> postIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.and(
				bidId != null ? criteriaBuilder.equal(e.get("debrisBid").get("id"), bidIdParam) : criteriaBuilder.conjunction()
				, postId != null ? criteriaBuilder.equal(e.get("debrisPost").get("id"),postIdParam) : criteriaBuilder.conjunction()
				);

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(bidIdParam, bidId);


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

		TypedQuery<DebrisTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(bidIdParam, bidId)
				.setMaxResults(limit)
				.setFirstResult(offset);



		if (bidId != null) {
			countTypedQuery.setParameter(bidIdParam, bidId);
			listTypedQuery.setParameter(bidIdParam, bidId);
		}

		if (postId != null) {
			countTypedQuery.setParameter(postIdParam, postId);
			listTypedQuery.setParameter(postIdParam, postId);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);

	}
}
