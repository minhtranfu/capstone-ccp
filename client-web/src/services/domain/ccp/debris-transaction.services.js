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
