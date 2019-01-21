import DataAccessService from '../data/data-access-service';


const CcpApiService = {
  getEquipmentTypes () {
    return DataAccessService.get('/equipments/types');
  },
  getEquipmentTypeInfos (typeId) {
    return DataAccessService.get(`/equipments/types/${typeId}/infos`);
  },
};
  
export default CcpApiService;  