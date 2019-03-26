import DataAccessService from '../../data/data-access-service';

export const getEquipmentTypes = () => {
  return DataAccessService.get('/equipmentTypes');
};

export const getEquipmentTypeCategories = () => {
  return DataAccessService.get('/generalEquipmentTypes');
};

export const postEquipment = data => {
  return DataAccessService.post('/equipments', data);
};

export const updateEquipment = (id, data) => {
  return DataAccessService.put(`/equipments/${id}`, data);
};

export const getEquipmentById = id => {
  return DataAccessService.get(`/equipments/${id}`);
};

export const getEquipmentsByContractorId = constractorId => {
  return DataAccessService.get(`contractors/${constractorId}/equipments`);
};

export const searchEquipments = criteria => {
  const params = Object.keys(criteria).map(key => `${key}=${encodeURIComponent(criteria[key])}`);
  const queryString = params.join('&');

  return DataAccessService.get(`/equipments?${queryString}`);
};

export const updateEquipmentStatus = (equipmentId, status) => {
  return DataAccessService.put(`/equipments/${equipmentId}/status`, { status });
};

export const uploadEquipmentImage = formData => {
  return DataAccessService.post('/storage/equipmentImages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
