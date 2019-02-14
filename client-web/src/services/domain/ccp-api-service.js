import DataAccessService from '../data/data-access-service';


const CcpApiService = {
  getEquipmentTypes() {
    return DataAccessService.get('/equipments/types');
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
};
  
export default CcpApiService;  