package daos;

import dtos.notifications.NotificationDTO;
import entities.ContractorEntity;
import entities.NotificationEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class NotificationDAO extends BaseDAO<NotificationEntity,Long> {
	public void insertNotification(NotificationDTO notificationDTO) {

		String title = notificationDTO.getTitle();
		String content =  notificationDTO.getContent();
		long contractorId = notificationDTO.getContractorId();
		String clickAction = notificationDTO.getClickAction();

		ContractorEntity contractorEntity = new ContractorEntity();
		contractorEntity.setId(contractorId);

		NotificationEntity notificationEntity = new NotificationEntity(title,content,contractorEntity,clickAction);

		this.persist(notificationEntity);
	}

	public List<NotificationEntity> getNotificationsByContractorId(long contractorId,int limit, int offset) {
		return entityManager.createNamedQuery("NotificationEntity.getByContractorId", NotificationEntity.class)
				.setParameter("contractorId", contractorId)
				.setFirstResult(offset)
				.setMaxResults(limit)
				.getResultList();
	}

	public Long getTotalUnreadNotification(long contractorId) {
		return entityManager.createNamedQuery("NotificationEntity.countUnreadByContractorId", Long.class)
				.setParameter("contractorId", contractorId)
				.getSingleResult();

	}

	public int markAllAsRead(long contractorId) {
		return entityManager.createNamedQuery("NotificationEntity.markAllAsRead")
				.setParameter("contractorId", contractorId)
				.executeUpdate();
	}
}
