package daos;

import entities.DebrisPostEntity;
import entities.DebrisServiceTypeDebrisPostEntity;
import utils.Constants;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
public class DebrisPostDAO extends BaseDAO<DebrisPostEntity, Long> {
	public List<DebrisPostEntity> getByRequester(long requesterId) {
		return entityManager.createNamedQuery("DebrisPostEntity.byRequester", DebrisPostEntity.class)
				.setParameter("requesterId", requesterId)
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
