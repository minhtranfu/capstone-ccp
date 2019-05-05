import qs from 'query-string';
import DataAccessService from '../../data/data-access-service';

export const postDebris = data => {
  return DataAccessService.post('/debrisPosts', data);
};

export const putDebris = (id, data) => {
  return DataAccessService.put(`/debrisPosts/${id}`, data);
};

export const getDebrisById = id => {
  return DataAccessService.get(`/debrisPosts/${id}`);
};

export const getMyDebrises = (params) => {
  const queryString = qs.stringify(params);
  return DataAccessService.get(`/debrisPosts/requester?${queryString}`);
};

export const getDebrisServiceTypes = () => {
  return DataAccessService.get('/debrisServiceTypes');
};

export const getDebrisServiceTypeById = id => {
  return DataAccessService.get(`/debrisServiceTypes/${id}`);
};

export const getDebrisesByCriteria = criteria => {
  const queryString = Object.keys(criteria)
  .map(k => {
    if (!Array.isArray(criteria[k])) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(criteria[k]);
    }

    return criteria[k].map(value => encodeURIComponent(k) + '=' + encodeURIComponent(value)).join('&');
  })
  .join('&');

  return DataAccessService.get(`/debrisPosts?${queryString}`);
};

export const uploadImages = formData => {
  return DataAccessService.post('/storage/debrisImages', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const deleteDebris = id => {
  return DataAccessService.delete(`/debrisPosts/${id}`);
};
