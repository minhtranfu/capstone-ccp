import DataAccessService from '../../data/data-access-service';

export const login = (username, password) => {
  return DataAccessService.post('/authen', { username, password });
};

export const register = (data) => {
  return DataAccessService.post('/authen/register', data);
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

export const markAllNotificationsAsRead = () => {
  return DataAccessService.post('/notifications/readAll');
};

export const uploadAvatar = formData => {
  return DataAccessService.post('/storage', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const updateContractorById = (id, data) => {
  return DataAccessService.put(`/contractors/${id}`, data);
};

export const getUserInfoById = id => {
  return DataAccessService.get(`/contractors/${id}`);
};

export const getVerifyingImages = contractorId => {
  return DataAccessService.get(`/contractors/${contractorId}/contractorVerifyingImages`);
};

export const uploadVerifyingImages = formData => {
  return DataAccessService.post(`/storage/contractorVerifyingImages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const addVerifyingImages = ({ contractorId, data }) => {
  return DataAccessService.post(`/contractors/${contractorId}/contractorVerifyingImages`, data);
};
