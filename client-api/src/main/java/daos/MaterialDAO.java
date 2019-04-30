package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.*;
import entities.MaterialEntity;
import managers.ElasticSearchManager;
import org.apache.commons.lang3.StringUtils;
import utils.CommonUtils;
import utils.Constants;

import javax.ejb.Stateless;
import javax.inject.Inject;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import javax.ws.rs.InternalServerErrorException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Stateless
public class MaterialDAO extends BaseDAO<MaterialEntity, Long> {

	private static final Logger LOGGER = Logger.getLogger(MaterialDAO.class.toString());
	@Inject
	ElasticSearchManager elasticSearchManager;

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
				//hidden
				, criteriaBuilder.equal(e.get("hidden"), false)
				//soft delete
				, criteriaBuilder.equal(e.get("deleted"), false)

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

	public List<MaterialEntity> searchMaterialByElasticSearch(Long contractorId, String query, long materialTypeId, String orderBy, int offset, int limit) {

		//"select e from MaterialEntity  e where e.materialType.id = :materialTypeId and e.name like '%query%'"
		List<Long> idList = elasticSearchManager.searchMaterial(contractorId, query, materialTypeId, orderBy);
		String idListString = StringUtils.join(idList.toArray(new Long[0]), ",");
		LOGGER.info("idListString="+idListString);

		if (idList.isEmpty()) {
			return new ArrayList<MaterialEntity>();
		}

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<MaterialEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialEntity.class);


		Root<MaterialEntity> e = criteriaQuery.from(MaterialEntity.class);


		ParameterExpression<List> idListParam = criteriaBuilder.parameter(List.class, "idListParam");
		ParameterExpression<String> idListStringParam = criteriaBuilder.parameter(String.class);

//		merge 3 main where clauses
		criteriaQuery.select(e).where(
				e.get("id").in(idListParam)
		);


		Order orderByIdListOrder = criteriaBuilder.asc(criteriaBuilder
				.function("find_in_set", Long.class, e.get("id"), idListStringParam));
		criteriaQuery.orderBy(orderByIdListOrder);

//
//		if (!orderBy.isEmpty()) {
//			List<Order> orderList = new ArrayList<>();
//			for (OrderByWrapper orderByWrapper : CommonUtils.getOrderList(orderBy)) {
//				if (orderByWrapper.isAscending()) {
//					orderList.add(criteriaBuilder.asc(e.get(orderByWrapper.getColumnName())));
//				} else {
//					orderList.add(criteriaBuilder.desc(e.get(orderByWrapper.getColumnName())));
//				}
//			}
//			criteriaQuery.orderBy(orderList);
//		}

		TypedQuery<MaterialEntity> typeQuery = entityManager.createQuery(criteriaQuery);

		typeQuery.setParameter(idListParam, idList);
		typeQuery.setParameter(idListStringParam, idListString);

		typeQuery.setFirstResult(offset);
		typeQuery.setMaxResults(limit);
		List<MaterialEntity> resultList = typeQuery.getResultList();
		// TODO: 4/28/19 sort result list by id
//		ArrayList<MaterialEntity> sortedResultList = new ArrayList<>();
//		for (Long id : idList) {
//			try {
//				sortedResultList.add(resultList.stream().filter(entity -> entity.getId() == id).findAny()
//						.orElseThrow(InternalServerErrorException::new));
//			} catch (InternalServerErrorException e1) {
//				e1.printStackTrace();
//				// simply dont add it =="
//			}
//		}
		return resultList;
	}

	public GETListResponse<MaterialEntity> getBySupplierId(long supplierId, int limit, int offset, String orderBy) {

		//select  e from MaterialEntity  e where e.contractor.id = :supplierId

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<MaterialEntity> criteriaQuery = criteriaBuilder.createQuery(MaterialEntity.class);

		Root<MaterialEntity> e = countQuery.from(MaterialEntity.class);
		criteriaQuery.from(MaterialEntity.class);


		ParameterExpression<Long> supplierIdParam = criteriaBuilder.parameter(Long.class);


		List<Predicate> whereClauses = new ArrayList<>();
		whereClauses.add(criteriaBuilder.equal(e.get("contractor").get("id"), supplierIdParam));

		//soft delete
		whereClauses.add((criteriaBuilder.equal(e.get("deleted"), false)));


		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClauses.toArray(new Predicate[0]));
		criteriaQuery.select(e).where(whereClauses.toArray(new Predicate[0]));
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
