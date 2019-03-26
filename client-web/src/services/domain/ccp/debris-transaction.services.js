import DataAccessService from '../../data/data-access-service';

export const postTransaction = data => {
  return DataAccessService.post('/debrisTransactions', data);
};

export const getTransactionById = id => {
  return DataAccessService.get(`/debrisTransactions/${id}`);
};

export const putTransaction = (id, data) => {
  return DataAccessService.put(`/debrisTransactions/${id}`, data);
};

export const getSupllyTransactions = () => {
  return DataAccessService.get(`/debrisTransactions/supplier`);
};

export const getRequestTransactions = () => {
  return DataAccessService.get(`/debrisTransactions/requester`);
};
