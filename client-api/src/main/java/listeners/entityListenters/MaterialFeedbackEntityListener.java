package listeners.entityListenters;

import daos.MaterialFeedbackDAO;
import daos.MaterialTransactionDAO;
import daos.MaterialTransactionDetailDAO;
import dtos.notifications.NotificationDTO;
import entities.*;
import managers.FirebaseMessagingManager;

import javax.inject.Inject;
import javax.persistence.PostPersist;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.ws.rs.BadRequestException;

public class MaterialFeedbackEntityListener {

	@Inject
	MaterialTransactionDetailDAO materialTransactionDetailDAO;

	@Inject
	MaterialFeedbackDAO materialFeedbackDAO;

	@Inject
	FirebaseMessagingManager firebaseMessagingManager;


	private void auditRequesterSupplier(MaterialFeedbackEntity entity) {
		MaterialTransactionDetailEntity managedTransaction = materialTransactionDetailDAO.findByIdWithValidation
				(entity.getMaterialTransactionDetail().getId());

		// 3/21/19 validate only 1 feedback
		if (managedTransaction.getMaterialFeedbackEntity() != null) {
			throw new BadRequestException("This transaction already has feedback");
		}
		entity.setRequester(managedTransaction.getMaterialTransaction().getRequester());
		entity.setSupplier(managedTransaction.getMaterialTransaction().getSupplier());
	}

	@PrePersist
	void prePersist(MaterialFeedbackEntity entity) {
		auditRequesterSupplier(entity);
	}

	@PreUpdate
	void preUpdate(MaterialFeedbackEntity entity) {
		auditRequesterSupplier(entity);
	}

	@PostPersist
	void postPersist(MaterialFeedbackEntity entity) {
		entity = materialFeedbackDAO.findByIdWithValidation(entity.getId());

		ContractorEntity supplier = entity.getSupplier();
		ContractorEntity requester = entity.getRequester();
		MaterialTransactionEntity materialTransaction = entity.getMaterialTransactionDetail().getMaterialTransaction();

		firebaseMessagingManager.sendMessage(new NotificationDTO(String.format("Material feedback from %s", requester.getName()),
				String.format("%s has sent feedback about \"%s\" after a material transaction", requester.getName(),
						entity.getMaterialTransactionDetail().getMaterial().getName())
				, supplier.getId()
				, NotificationDTO.makeClickAction(NotificationDTO.ClickActionDestination.MATERIAL_TRANSACTIONS,
				materialTransaction.getId()))
		);

	}


}
