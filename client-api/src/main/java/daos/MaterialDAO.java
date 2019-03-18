package daos;

import entities.AvailableTimeRangeEntity;
import entities.MaterialEntity;
import entities.HiringTransactionEntity;
import entities.MaterialEntity;
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

	public List<MaterialEntity> searchMaterial(String query, long materialTypeId, String orderBy, int offset, int limit) {

		//"select e from MaterialEntity  e where e.materialType.id = :materialTypeId and e.name like '%query%'"


		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<MaterialEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialEntity.class);


		Root<MaterialEntity> e = criteriaQuery.from(MaterialEntity.class);


		ParameterExpression<Long> materialTypeIdParam = criteriaBuilder.parameter(Long.class);
		ParameterExpression<String> queryParam = criteriaBuilder.parameter(String.class);



//		merge 3 main where clauses
		criteriaQuery.select(e).where(
				materialTypeId != 0 ? criteriaBuilder.equal(materialTypeIdParam, e.get("materialType").get("id")) : criteriaBuilder.conjunction()
				, criteriaBuilder.like(e.get("name"), queryParam)
				, criteriaBuilder.equal(e.get("is_hidden"), false)
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

		if (materialTypeId > 0) {
			typeQuery.setParameter(materialTypeIdParam, materialTypeId);
		}
		typeQuery.setParameter(queryParam, "%" + query + "%");

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);

		return typeQuery.getResultList();
	}

}
