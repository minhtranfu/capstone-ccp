import DataAccessService from '../../data/data-access-service';

export const postTransaction = transaction => {
  return DataAccessService.post('/transactions', transaction);
};

export const getTransactionsById = id => {
  return DataAccessService.get(`/transactions/${id}`);
};

export const getConstructionsByContractorId = constractorId => {
  return DataAccessService.get(`/contractors/${constractorId}/constructions`);
};

export const getTransactionsBySupplierId = supplierId => {
  return DataAccessService.get(`/transactions/supplier/${supplierId}`);
};

export const getTransactionsByRequesterId = requesterId => {
  return DataAccessService.get(`/transactions/requester/${requesterId}`);
};

export const updateTransactionById = (transactionId, data) => {
  return DataAccessService.put(`/transactions/${transactionId}`, data);
};

export const extendHiringTime = data => {
  return DataAccessService.post('/transactionDateChangeRequests', data);
};

export const updateStatusDateChangeRequest = (id, status) => {
  return DataAccessService.put(`/transactionDateChangeRequests/${id}`, { status });
};
