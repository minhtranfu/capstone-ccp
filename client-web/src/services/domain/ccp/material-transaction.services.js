import { DataAccessService } from "Services/data/data-access-service";

export const getTransactionById = id => {
  return DataAccessService.get(`/materialTransactions/${id}`);
};

export const getTransactionsByRequesterId = requesterId => {
  return DataAccessService.get(`/materialTransactions/requester/${requesterId}`);
};

export const getTransactionsBySupplierId = supplierId => {
  return DataAccessService.get(`/materialTransactions/requester/${supplierId}`);
};

export const postTransaction = transaction => {
  return DataAccessService.post('/materialTransactions', transaction);
};

export const updateTransaction = (id, data) => {
  return DataAccessService.put(`/materialTransactions/${id}`, data);
};