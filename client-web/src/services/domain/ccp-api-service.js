import DataAccessService from '../data/data-access-service';
import * as userServices from './ccp/user.services';

const CcpApiService = {
  getEquipmentTypes() {
    return DataAccessService.get('/equipmentTypes');
  },
  getEquipmentTypeSpecs(typeId) {
    return DataAccessService.get(`/equipments/types/${typeId}/specs`);
  },
  postEquipment(data) {
    return DataAccessService.post('/equipments', data);
  },
  getEquipmentById(id) {
    return DataAccessService.get(`/equipments/${id}`);
  },
  searchEquipment(criteria) {
    const params = Object.keys(criteria).map(key => `${key}=${encodeURIComponent(criteria[key])}`);
    const queryString = params.join('&');
    return DataAccessService.get(`/equipments?${queryString}`);
  },
  postTransaction(transaction) {
    return DataAccessService.post('/transactions', transaction);
  },
  getTransactionsById(id) {
    return DataAccessService.get(`/transactions/${id}`);
  },
  getEquipmentsByContractorId(constractorId) {
    return DataAccessService.get(`contractors/${constractorId}/equipments`);
  },
  getConstructionsByContractorId(constractorId) {
    return DataAccessService.get(`contractors/${constractorId}/constructions`);
  },
  getTransactionsBySupplierId(supplierId) {
    return DataAccessService.get(`transactions/supplier/${supplierId}`);
  },
  getTransactionsByRequesterId(requesterId) {
    return DataAccessService.get(`transactions/requester/${requesterId}`);
  },
  updateTransactionById(transactionId, data) {
    return DataAccessService.put(`transactions/${transactionId}`, data);
  },
  updateEquipmentStatus(equipmentId, status) {
    return DataAccessService.put(`/equipments/${equipmentId}/status`, { status });
  },
  postConstruction(constractorId, data) {
    return DataAccessService.post(`/contractors/${constractorId}/constructions`, data);
  },
  updateConstruction(constractorId, constructionId, data) {
    return DataAccessService.put(`/contractors/${constractorId}/constructions/${constructionId}`, data);
  },
  userServices
};

export default CcpApiService;
