import DataAccessService from '../../data/data-access-service';

export const postTransaction = transaction => {
  return DataAccessService.post('/transactions', transaction);
};

export const getTransactionsById = id => {
  return DataAccessService.get(`/transactions/${id}`);
};

export const getEquipmentsByContractorId = constractorId => {
  return DataAccessService.get(`contractors/${constractorId}/equipments`);
};

export const getConstructionsByContractorId = constractorId => {
  return DataAccessService.get(`contractors/${constractorId}/constructions`);
};

export const getTransactionsBySupplierId = supplierId => {
  return DataAccessService.get(`transactions/supplier/${supplierId}`);
};

export const getTransactionsByRequesterId = requesterId => {
  return DataAccessService.get(`transactions/requester/${requesterId}`);
};

export const updateTransactionById = (transactionId, data) => {
  return DataAccessService.put(`transactions/${transactionId}`, data);
};