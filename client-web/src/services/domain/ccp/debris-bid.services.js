import DataAccessService from '../../data/data-access-service';

export const getDebrisBidById = id => {
  return DataAccessService.get(`/debrisBids/${id}`);
};

export const getDebrisBidBySupplierId = id => {
  return DataAccessService.get('/debrisBids/supplier');
};

export const postDebrisBid = data => {
  return DataAccessService.post('/debrisBids', data);
};

export const putDebrisBid = (id, data) => {
  return DataAccessService.put(`/debrisBids/${id}`, data);
};

export const deleteDebrisBid = id => {
  return DataAccessService.delete(`/debrisBids/${id}`);
};
