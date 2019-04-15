package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.*;
import entities.MaterialEntity;
import utils.CommonUtils;
import utils.Constants;

import javax.ejb.Stateless;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
public class MaterialDAO extends BaseDAO<MaterialEntity, Long> {

	public List<MaterialEntity> searchMaterial(Long contractorId, String query, long materialTypeId, String orderBy, int offset, int limit) {

		//"select e from MaterialEntity  e where e.materialType.id = :materialTypeId and e.name like '%query%'"


		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<MaterialEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialEntity.class);


		Root<MaterialEntity> e = criteriaQuery.from(MaterialEntity.class);


		ParameterExpression<Long> contractorIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<Long> materialTypeIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<String> queryParam = criteriaBuilder.parameter(String.class);

//		merge 3 main where clauses
		criteriaQuery.select(e).where(
				materialTypeId != 0 ? criteriaBuilder.equal(materialTypeIdParam, e.get("materialType").get("id")) : criteriaBuilder.conjunction()
				, contractorId != null ? criteriaBuilder.notEqual(e.get("contractor").get("id"), contractorIdParam) : criteriaBuilder.conjunction()
				, criteriaBuilder.like(e.get("name"), queryParam)
				, criteriaBuilder.equal(e.get("hidden"), false)
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

		TypedQuery<MaterialEntity> typeQuery = entityManager.createQuery(criteriaQuery);

		if (contractorId != null) {
			typeQuery.setParameter(contractorIdParam, contractorId);
		}
		if (materialTypeId > 0) {
			typeQuery.setParameter(materialTypeIdParam, materialTypeId);
		}
		typeQuery.setParameter(queryParam, "%" + query + "%");

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);

		return typeQuery.getResultList();
	}

	public Object getBySupplierId(long supplierId, int limit, int offset, String orderBy) {

		//select  e from MaterialEntity  e where e.contractor.id = :supplierId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialEntity.class);

		Root<MaterialEntity> e = countQuery.from(MaterialEntity.class);
		criteriaQuery.from(MaterialEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.equal(e.get("contractor").get("id"), supplierIdParam);

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

		TypedQuery<MaterialEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(supplierIdParam, supplierId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<MaterialEntity> materialEntities = listTypedQuery.getResultList();

		return new GETListResponse<MaterialEntity>(itemCount, limit, offset, orderBy, materialEntities);

	}
}
