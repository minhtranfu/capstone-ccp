package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.EquipmentFeedbackEntity;
import utils.CommonUtils;
import utils.Constants;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class EquipmentFeedbackDAO extends BaseDAO<EquipmentFeedbackEntity, Long> {
	public List<EquipmentFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("EquipmentFeedbackEntity.bySupplier", EquipmentFeedbackEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();
	}

	public GETListResponse<EquipmentFeedbackEntity> getFeedbacksBySupplier(long supplierId, int limit, int offset, String orderBy) {

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<EquipmentFeedbackEntity> criteriaQuery = criteriaBuilder.createQuery(EquipmentFeedbackEntity.class);

		Root<EquipmentFeedbackEntity> e = countQuery.from(EquipmentFeedbackEntity.class);
		criteriaQuery.from(EquipmentFeedbackEntity.class);


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

		TypedQuery<EquipmentFeedbackEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setHint(Constants.DEFAULT_ENTITY_GRAPH_TYPE, entityManager.getEntityGraph("graph.EquipmentFeedbackEntity.includeAll"))
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<EquipmentFeedbackEntity> equipmentFeedbackEntities = listTypedQuery.getResultList();

		return new GETListResponse<EquipmentFeedbackEntity>(itemCount, limit, offset, orderBy, equipmentFeedbackEntities);


	}

	public double calculateAverageEquipmentRating(long contractorId) {
		return entityManager.createQuery("select avg(e.rating) from EquipmentFeedbackEntity e where e.supplier.id = :contractorId", Double.class)
				.getSingleResult();
	}

	@Override
	public EquipmentFeedbackEntity findByID(Long id) {
		return findByID(id, "graph.EquipmentFeedbackEntity.includeAll");
	}
}
