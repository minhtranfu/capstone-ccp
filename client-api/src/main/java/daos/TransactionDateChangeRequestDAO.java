package daos;

import dtos.responses.GETListResponse;
import dtos.wrappers.OrderByWrapper;
import entities.HiringTransactionEntity;
import entities.TransactionDateChangeRequestEntity;
import utils.CommonUtils;

import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.*;
import javax.ws.rs.BadRequestException;
import java.util.ArrayList;
import java.util.List;

@Stateless
public class TransactionDateChangeRequestDAO extends BaseDAO<TransactionDateChangeRequestEntity, Long> {
	@PersistenceContext
	EntityManager entityManager;

	public void validateOnlyOnePendingRequest(long transactionId) {
		int count = entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId")
				.setParameter("transactionId", transactionId)
				.getResultList().size();
		if (count != 0) {
			throw new BadRequestException("this transaction already has another pending requests!");
		}
	}

	public List<TransactionDateChangeRequestEntity> getRequestsByTransactionId(long transactionId, int limit, int offset) {


		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getRequestsByTransactionId"
				, TransactionDateChangeRequestEntity.class)
				.setParameter("transactionId", transactionId)
				.setMaxResults(limit)
				.setFirstResult(offset)
				.getResultList();

	}

	public List<TransactionDateChangeRequestEntity> getPendingRequestByTransactionId(long transactionId) {


		return entityManager.createNamedQuery("TransactionDateChangeRequestEntity.getPendingRequestByTransactionId", TransactionDateChangeRequestEntity.class)
				.setParameter("transactionId", transactionId)
				.getResultList();

	}

	public GETListResponse<TransactionDateChangeRequestEntity> getRequestsByTransactionId(Long transactionId, int limit, int offset, String orderBy) {

		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> countQuery = criteriaBuilder.createQuery(Long.class);
		CriteriaQuery<TransactionDateChangeRequestEntity> criteriaQuery = criteriaBuilder.createQuery(TransactionDateChangeRequestEntity.class);

		Root<TransactionDateChangeRequestEntity> e = countQuery.from(TransactionDateChangeRequestEntity.class);
		criteriaQuery.from(TransactionDateChangeRequestEntity.class);

		ParameterExpression<Long> transactionIdParam = criteriaBuilder.parameter(Long.class);

		Predicate whereClause = criteriaBuilder.and(
				criteriaBuilder.equal(e.get("hiringTransactionEntity").get("id"), transactionIdParam)
		);

		countQuery.select(criteriaBuilder.count(e.get("id"))).where(whereClause);
		criteriaQuery.select(e).where(whereClause);
		TypedQuery<Long> countTypedQuery = entityManager.createQuery(countQuery)
				.setParameter(transactionIdParam, transactionId);


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

		TypedQuery<TransactionDateChangeRequestEntity> listTypedQuery = entityManager.createQuery(criteriaQuery)
				.setParameter(transactionIdParam, transactionId)
				.setMaxResults(limit)
				.setFirstResult(offset);


		Long itemCount = countTypedQuery.getSingleResult();
		List<TransactionDateChangeRequestEntity> transactionDateChangeRequestEntities = listTypedQuery.getResultList();

		return new GETListResponse<>(itemCount, limit, offset, orderBy, transactionDateChangeRequestEntities);
	}
}
