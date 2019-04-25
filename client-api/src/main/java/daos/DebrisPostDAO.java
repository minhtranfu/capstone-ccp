package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.DebrisBidEntity;
import entities.DebrisPostEntity;
import entities.DebrisServiceTypeDebrisPostEntity;
import utils.CommonUtils;
import utils.Constants;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
public class DebrisPostDAO extends BaseDAO<DebrisPostEntity, Long> {
	public GETListResponse<DebrisPostEntity> getByRequester(long requesterId, DebrisPostEntity.Status status, int limit, int offset, String orderBy) {

		//select e from DebrisPostEntity e where e.requester.id = :requesterId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisPostEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisPostEntity.class);

		Root<DebrisPostEntity> e = countQuery.from(DebrisPostEntity.class);
		criteriaQuery.from(DebrisPostEntity.class);


		ParameterExpression<Long> requesterIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<DebrisPostEntity.Status> statusParam = criteriaBuilder.parameter(DebrisPostEntity.Status.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("requester").get("id"), requesterIdParam)
				//soft delete
				,criteriaBuilder.equal(e.get("deleted"),false)
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

		TypedQuery<DebrisPostEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(requesterIdParam, requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset);

		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisPostEntity> debrisPostEntities = listTypedQuery.getResultList();

		return new GETListResponse<DebrisPostEntity>(itemCount, limit, offset, orderBy, debrisPostEntities);

	}
	public GETListResponse<DebrisPostEntity> getByBidedSupplier(long supplierId, DebrisPostEntity.Status status, int limit, int offset, String orderBy) {

		//select p from DebrisPostEntity p where exists (select b from DebrisBidEntity b where b.debrisPost.id  = p.id and b.supplier = :supplierId ) and p.status=:status

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<DebrisPostEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisPostEntity.class);

		Root<DebrisPostEntity> p = countQuery.from(DebrisPostEntity.class);
		criteriaQuery.from(DebrisPostEntity.class);
		Subquery<DebrisBidEntity> subBidQuery = countQuery.subquery(DebrisBidEntity.class);
		Root<DebrisBidEntity> b = subBidQuery.from(DebrisBidEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<DebrisPostEntity.Status> statusParam = criteriaBuilder.parameter(DebrisPostEntity.Status.class);


		subBidQuery.select(b).where(
				criteriaBuilder.equal(b.get("debrisPost").get("id"), p.get("id"))
				//soft delete
				, criteriaBuilder.equal(b.get("deleted"),false)
				, criteriaBuilder.equal(b.get("supplier").get("id"), supplierIdParam)
		);

				
		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.exists(subBidQuery)
				//soft delete
				, criteriaBuilder.equal(p.get("deleted"),false)
				, status != null ? criteriaBuilder.equal(p.get("status"), statusParam) : criteriaBuilder.conjunction());

		countQuery.select(criteriaBuilder.count(p.get("id"))).where(whereClause);
		criteriaQuery.select(p).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(supplierIdParam, supplierId);


		if (!orderBy.isEmpty()) {
			List<Order> orderList = new ArrayList<>();
			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
				if (orderByWrapper.isAscending()) {
					orderList.add(criteriaBuilder.asc(p.get(orderByWrapper.getColumnName())));
				} else {
					orderList.add(criteriaBuilder.desc(p.get(orderByWrapper.getColumnName())));
				}
			}
			criteriaQuery.orderBy(orderList);
		}

		TypedQuery<DebrisPostEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);

		if (status != null) {
			countTypedQuery.setParameter(statusParam, status);
			listTypedQuery.setParameter(statusParam, status);
		}

		Long itemCount = countTypedQuery.getSingleResult();
		List<DebrisPostEntity> debrisPostEntities = listTypedQuery.getResultList();

		return new GETListResponse<DebrisPostEntity>(itemCount, limit, offset, orderBy, debrisPostEntities);

	}
	public List<DebrisPostEntity> getByRequester(long requesterId, int limit, int offset) {
		return entityManager.createNamedQuery("DebrisPostEntity.byRequester", DebrisPostEntity.class)
				.setParameter("requesterId", requesterId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();

	}

	public List<DebrisPostEntity> searchDebrisPost(
			Long contractorId
			, String query
			, Double latitude
			, Double longitude
			, Double maxDistance
			, List<Long> debrisTypeIdList
			, String orderBy
			, int offset, int limit) {


		//select e from DebrisPostEntity  e where 1=1  and e.title like '%a%' and calcDistance(e.latitude,e.longitude,10,106) <= 1000 and exists (select t from DebrisServiceTypeDebrisPostEntity t where t.debrisPostId = e.id and t.debrisServiceTypeId in (1,3)) and e.hidden = false  and e.status = 'PENDING'


		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<DebrisPostEntity> criteriaQuery = criteriaBuilder.createQuery(DebrisPostEntity.class);


		Root<DebrisPostEntity> e = criteriaQuery.from(DebrisPostEntity.class);

		ParameterExpression<Long> contractorIdParam = criteriaBuilder.parameter(Long.class);

		ParameterExpression<Double> curLatParam = criteriaBuilder.parameter(Double.class);
		ParameterExpression<Double> curLongParam = criteriaBuilder.parameter(Double.class);
		ParameterExpression<Double> maxDistanceParam = criteriaBuilder.parameter(Double.class);


		ParameterExpression<List> debrisServiceTypesParam = criteriaBuilder.parameter(List.class);

		ParameterExpression<String> queryParam = criteriaBuilder.parameter(String.class);


		Predicate distanceWhereClause;
		if (latitude != null && longitude != null && maxDistance != null) {
			distanceWhereClause = criteriaBuilder
					.lessThan(
							criteriaBuilder.function("calcDistance"
									, Double.class, e.get("latitude"), e.get("longitude")
									, curLatParam, curLongParam)
							, maxDistanceParam);
		} else {
			distanceWhereClause = criteriaBuilder.conjunction();
		}


		Predicate debrisServiceTypeWhereClause;

		if (debrisTypeIdList != null && !debrisTypeIdList.isEmpty()) {
			//debrisServiceTypeWhereClause
			Subquery<DebrisServiceTypeDebrisPostEntity> subquery = criteriaQuery.subquery(DebrisServiceTypeDebrisPostEntity.class);
			Root<DebrisServiceTypeDebrisPostEntity> t = subquery.from(DebrisServiceTypeDebrisPostEntity.class);
			subquery.select(t).where(criteriaBuilder.equal(t.get("debrisPostId"), e.get("id"))
					, t.get("debrisServiceTypeId").in(debrisServiceTypesParam));
			debrisServiceTypeWhereClause = criteriaBuilder.exists(subquery);

		} else {
			debrisServiceTypeWhereClause = criteriaBuilder.conjunction();
		}


//		merge 3 main where clauses
		criteriaQuery.select(e).where(
				criteriaBuilder.like(e.get("title"), queryParam)
				, distanceWhereClause
				, debrisServiceTypeWhereClause
				, contractorId != null ? criteriaBuilder.notEqual(e.get("requester").get("id"), contractorIdParam) : criteriaBuilder.conjunction()
				, criteriaBuilder.equal(e.get("hidden"), false)
				//soft delete
				, criteriaBuilder.equal(e.get("delete"),false)
				, criteriaBuilder.equal(e.get("status"), DebrisPostEntity.Status.PENDING)
		);

		if (!orderBy.isEmpty()) {
			List<Order> orderList = new ArrayList<>();
			// TODO: 2/14/19 string split to orderBy list
			Pattern pattern = Pattern.compile(Constants.RESOURCE_REGEX_ORDERBY_SINGLEITEM);

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
			criteriaQuery.orderBy(orderList);
		}

		TypedQuery<DebrisPostEntity> typeQuery = entityManager.createQuery(criteriaQuery);


		//set parameters
		if (contractorId != null) {
			typeQuery.setParameter(contractorIdParam, contractorId);
		}


		if (latitude != null && longitude != null && maxDistance != null) {
			typeQuery.setParameter(curLatParam, latitude);
			typeQuery.setParameter(curLongParam, longitude);
			typeQuery.setParameter(maxDistanceParam, maxDistance);
		}


		if (debrisTypeIdList != null && !debrisTypeIdList.isEmpty()) {
			typeQuery.setParameter(debrisServiceTypesParam, debrisTypeIdList);
		}

		typeQuery.setParameter(queryParam, "%" + query + "%");

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);

		return typeQuery.getResultList();


	}
}
