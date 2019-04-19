package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.MaterialTransactionDetailEntity;
import entities.MaterialTransactionEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class MaterialTransactionDAO extends BaseDAO<MaterialTransactionEntity, Long> {
	public List<MaterialTransactionEntity> getNamedMaterialTransactionsBySupplierId(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.BySupplierId", MaterialTransactionEntity.class)
				.setParameter("supplierId", supplierId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();

	}

	public GETListResponse<MaterialTransactionEntity> getMaterialTransactionsBySupplierId(long supplierId, MaterialTransactionEntity.Status status, int limit, int offset, String orderBy) {
		//select e from MaterialTransactionEntity  e where e.supplier.id = :supplierId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialTransactionEntity.class);

		Root<MaterialTransactionEntity> e = countQuery.from(MaterialTransactionEntity.class);
		criteriaQuery.from(MaterialTransactionEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<MaterialTransactionEntity.Status> statusParam = criteriaBuilder.parameter(MaterialTransactionEntity.Status.class);

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

		TypedQuery<MaterialTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);

	}


	public List<MaterialTransactionEntity> getNamedMaterialTransactionsByRequeseterId(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialTransactionEntity.ByRequesterId", MaterialTransactionEntity.class)
				.setParameter("requesterId", requesterId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}
	
	public GETListResponse<MaterialTransactionEntity> getMaterialTransactionsByRequesterId(long requesterId, MaterialTransactionEntity.Status status, int limit, int offset, String orderBy) {
		//select e from MaterialTransactionEntity  e where e.requester.id = :requesterId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialTransactionEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialTransactionEntity.class);

		Root<MaterialTransactionEntity> e = countQuery.from(MaterialTransactionEntity.class);
		criteriaQuery.from(MaterialTransactionEntity.class);


		ParameterExpression<Long> requesterIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<MaterialTransactionEntity.Status> statusParam = criteriaBuilder.parameter(MaterialTransactionEntity.Status.class);

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

		TypedQuery<MaterialTransactionEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(requesterIdParam, requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialTransactionEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);

	}


	public GETListResponse<MaterialTransactionDetailEntity> getByMaterialId(long materialId, int limit, int offset, String orderBy) {

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialTransactionDetailEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialTransactionDetailEntity.class);

		Root<MaterialTransactionDetailEntity> e = countQuery.from(MaterialTransactionDetailEntity.class);
		criteriaQuery.from(MaterialTransactionDetailEntity.class);


		ParameterExpression<Long> materialIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("material").get("id"), materialIdParam)
		);

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(materialIdParam, materialId);

		//set distinct
		countQuery.distinct(true);
		criteriaQuery.distinct(true);
		
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

		TypedQuery<MaterialTransactionDetailEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(materialIdParam, materialId)
				.setMaxResults(limit)
				.setFirstResult(offset);



		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialTransactionDetailEntity> hiringTransactionEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, hiringTransactionEntities);

	}
}
