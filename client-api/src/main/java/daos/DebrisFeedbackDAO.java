package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.DebrisFeedbackEntity;
import entities.EquipmentFeedbackEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.EntityGraph;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DebrisFeedbackDAO extends BaseDAO<DebrisFeedbackEntity, Long> {
	public List<DebrisFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisFeedbackEntity.bySupplier", DebrisFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.setHint("javax.persistence.loadgraph",entityManager.getEntityGraph("graph.DebrisFeedbackEntity.includeAll"))
				.getResultList();
	}

	public GETListResponse<DebrisFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset, String orderBy) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisFeedbackEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisFeedbackEntity.class);

		Root<DebrisFeedbackEntity> e = countQuery.from(DebrisFeedbackEntity.class);
		criteriaQuery.from(DebrisFeedbackEntity.class);


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


		TypedQuery<DebrisFeedbackEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setHint("javax.persistence.loadgraph",entityManager.getEntityGraph("graph.DebrisFeedbackEntity.includeAll"))
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisFeedbackEntity> debrisFeedbackEntities = listTypedQuery.getResultList();

		return new GETListResponse<DebrisFeedbackEntity>(itemCount, limit, offset, orderBy, debrisFeedbackEntities);
	}

	public double calculateAverageDebrisRating(long contractorId) {
		return entityManager.createQuery("select avg(e.rating) from DebrisFeedbackEntity e where e.supplier.id = :contractorId",Double.class)
				.getSingleResult();

	}


	@Override
	public DebrisFeedbackEntity findByID(Long id) {
		return findByID(id, "graph.DebrisFeedbackEntity.includeAll");
	}
}
