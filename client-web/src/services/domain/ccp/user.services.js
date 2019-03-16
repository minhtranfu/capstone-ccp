import DataAccessService from '../../data/data-access-service';

export const login = (username, password) => {
  return DataAccessService.post('/authen', { username, password });
};

export const getUserInfo = () => {
  return DataAccessService.get('/token/contractor');
};

export const sendNotificationToken = registrationToken => {
  return DataAccessService.post(`/notificationTokens`, { registrationToken, deviceType:"WEB" });
};

export const unsubcribeNotification = registrationToken => {
  return DataAccessService.delete(`/notificationTokens`, { registrationToken });
};