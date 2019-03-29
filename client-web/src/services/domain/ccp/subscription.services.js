import DataAccessService from '../../data/data-access-service';

export const getAllSubscriptionsOfContractor = () => {
  return DataAccessService.get('/subscriptions');
};

export const getSubscriptionById = id => {
  return DataAccessService.get(`/subscriptions/${id}`);
};

export const postSubscription = data => {
  return DataAccessService.post('/subscriptions', data);
};

export const updateSubscription = (id, data) => {
  return DataAccessService.put(`/subscriptions/${id}`, data);
};

export const deleteSubscription = id => {
  return DataAccessService.delete(`/subscriptions/${id}`);
};
