import DataAccessService from '../../data/data-access-service';
import { toQueryString } from 'Utils/common.utils';

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
  const query = toQueryString({limit, offset});
  return DataAccessService.get(`/notifications?${query}`)
};

export const updateNotificationStatus = (id, isRead) => {
  return DataAccessService.put(`/notifications/${id}`, {
    read: isRead
  });
};
