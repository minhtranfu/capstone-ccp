package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.MaterialFeedbackEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class MaterialFeedbackDAO extends BaseDAO<MaterialFeedbackEntity, Long> {
	public List<MaterialFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialFeedbackEntity.bySupplier", MaterialFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	public List<MaterialFeedbackEntity> getFeedbacksByMaterial(long materialId, int limit, int offset) {
		return entityManager.createNamedQuery("MaterialFeedbackEntity.byMaterial", MaterialFeedbackEntity.class)
				.setParameter("materialId", materialId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();


	}

	public GETListResponse<MaterialFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset, String orderBy) {

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialFeedbackEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialFeedbackEntity.class);

		Root<MaterialFeedbackEntity> e = countQuery.from(MaterialFeedbackEntity.class);
		criteriaQuery.from(MaterialFeedbackEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("supplier").get("id"), supplierIdParam)
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

		TypedQuery<MaterialFeedbackEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialFeedbackEntity> materialFeedbackEntities = listTypedQuery.getResultList();
		return new GETListResponse<MaterialFeedbackEntity>(itemCount, limit, offset, orderBy, materialFeedbackEntities);

	}

	public GETListResponse<MaterialFeedbackEntity> getFeedbacksByMaterial(long materialId, int limit, int offset, String orderBy) {

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialFeedbackEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialFeedbackEntity.class);

		Root<MaterialFeedbackEntity> e = countQuery.from(MaterialFeedbackEntity.class);
		criteriaQuery.from(MaterialFeedbackEntity.class);


		ParameterExpression<Long> materialIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("materialTransactionDetail").get("material").get("id"), materialIdParam)
		);

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(materialIdParam, materialId);


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

		TypedQuery<MaterialFeedbackEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(materialIdParam, materialId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialFeedbackEntity> materialFeedbackEntities = listTypedQuery.getResultList();
		return new GETListResponse<MaterialFeedbackEntity>(itemCount, limit, offset, orderBy, materialFeedbackEntities);

	}
}
