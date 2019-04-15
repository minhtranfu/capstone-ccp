package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.DebrisBidEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class DebrisBidDAO extends BaseDAO<DebrisBidEntity,Long> {
	public GETListResponse<DebrisBidEntity> getBySupplier(long supplierId, DebrisBidEntity.Status status, int limit, int offset, String orderBy) {
//select e from DebrisPostEntity e where e.requester.id = :requesterId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisBidEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisBidEntity.class);

		Root<DebrisBidEntity> e = countQuery.from(DebrisBidEntity.class);
		criteriaQuery.from(DebrisBidEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<DebrisBidEntity.Status> statusParam = criteriaBuilder.parameter(DebrisBidEntity.Status.class);

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

		TypedQuery<DebrisBidEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);

		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisBidEntity> debrisBidEntities = listTypedQuery.getResultList();

		return new GETListResponse<DebrisBidEntity>(itemCount, limit, offset, orderBy, debrisBidEntities);


	}
	public List<DebrisBidEntity> getBySupplier(long supplierId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisBidEntity.bySupplier", DebrisBidEntity.class)
				.setParameter("supplierId", supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();

	}
}

