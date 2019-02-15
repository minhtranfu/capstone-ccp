import DataAccessService from '../data/data-access-service';


const CcpApiService = {
  getEquipmentTypes() {
    return DataAccessService.get('/equipmentTypes');
  },
  getEquipmentTypeSpecs(typeId) {
    return DataAccessService.get(`/equipments/types/${typeId}/specs`);
  },
  postEquipment(data) {
    return DataAccessService.post(`/equipments`, data);
  },
  getEquipmentById(id) {
    return DataAccessService.get(`/equipments/${id}`);
  },
  searchEquipment(criteria) {
    const params = Object.keys(criteria).map(key => `${key}=${encodeURIComponent(criteria[key])}`);
    const queryString = params.join('&');
    return DataAccessService.get(`/equipments?${queryString}`);
  },
};
  
export default CcpApiService;  