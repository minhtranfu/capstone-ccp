import DataAccessService from '../../data/data-access-service';

export const login = (username, password) => {
  return DataAccessService.post('/authen', { username, password });
};

export const register = (data) => {
  return DataAccessService.post('/register', data);
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

export const getNotifications = ({limit, offset}) => {
  return DataAccessService.get(`/notifications?limit=${limit}&offset=${offset}`);
};

export const updateNotificationStatus = (id, isRead) => {
  return DataAccessService.put(`/notifications/${id}`, {
    read: isRead
  });
};
