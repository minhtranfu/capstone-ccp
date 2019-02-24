import DataAccessService from '../data/data-access-service';

const CcpApiService = {
  getEquipmentTypes () {
    return DataAccessService.get('/equipmentTypes');
  },
  getEquipmentTypeSpecs (typeId) {
    return DataAccessService.get(`/equipments/types/${typeId}/specs`);
  },
  postEquipment (data) {
    return DataAccessService.post('/equipments', data);
  },
  getEquipmentById (id) {
    return DataAccessService.get(`/equipments/${id}`);
  },
  searchEquipment (criteria) {
    const params = Object.keys(criteria).map(key => `${key}=${encodeURIComponent(criteria[key])}`);
    const queryString = params.join('&');
    return DataAccessService.get(`/equipments?${queryString}`);
  },
  postTransaction (transaction) {
    return DataAccessService.post('/transactions', transaction);
  },
  getEquipmentsByContractorId (constractorId) {
    return DataAccessService.get(`contractors/${constractorId}/equipments`);
  },
  getConstructionsByContractorId (constractorId) {
    return DataAccessService.get(`contractors/${constractorId}/constructions`);
  },
  getTransactionsByRequesterId (requesterId) {
    return DataAccessService.get(`transactions/requester/${requesterId}`);
  },
  updateTransactionById (transactionId, data) {
    return DataAccessService.put(`transactions/${transactionId}`, data);
  }
};

export default CcpApiService;
