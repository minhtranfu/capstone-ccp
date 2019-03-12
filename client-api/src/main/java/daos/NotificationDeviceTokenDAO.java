package daos;

import entities.NotificationDeviceTokenEntity;

import javax.ejb.Stateless;

@Stateless
public class NotificationDeviceTokenDAO extends BaseDAO<NotificationDeviceTokenEntity,Long> {

	public int deleteToken(String token, long contractorId) {
		int deletedTokens = entityManager.createNamedQuery("NotificationDeviceTokenEntity.removeByToken")
				.setParameter("contractorId", contractorId)
				.setParameter("token",token)
				.executeUpdate();
		return deletedTokens;
	}

}
