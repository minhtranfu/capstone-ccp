package daos;

import entities.NotificationDeviceTokenEntity;

import javax.ejb.Stateless;
import java.util.List;

@Stateless
public class NotificationDeviceTokenDAO extends BaseDAO<NotificationDeviceTokenEntity,Long> {

	public int deleteToken(String token, long contractorId) {
		int deletedTokens = entityManager.createNamedQuery("NotificationDeviceTokenEntity.removeByToken")
				.setParameter("contractorId", contractorId)
				.setParameter("token",token)
				.executeUpdate();
		return deletedTokens;
	}

	public List<NotificationDeviceTokenEntity> findByToken(String token, long contractorId) {
		List<NotificationDeviceTokenEntity> resultList = entityManager.createNamedQuery("NotificationDeviceTokenEntity.findByTokenContractor", NotificationDeviceTokenEntity.class)
				.setParameter("token", token)
				.setParameter("contractorId", contractorId)
				.getResultList();
		return resultList;
	}

}
