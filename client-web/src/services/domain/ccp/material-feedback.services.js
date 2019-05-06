import DataAccessService from '../../data/data-access-service';
import { toQueryString } from 'Utils/common.utils';

export const postFeedback = data => {
  return DataAccessService.post('/materialFeedbacks', data);
};

export const getFeedbackById = id => {
  return DataAccessService.get(`/materialFeedbacks/${id}`);
};

export const getFeedbackBySupplierId = (id, queryData) => {
  const data = {
    ...queryData,
    supplierId: id,
  };
  
  return DataAccessService.get(`/materialFeedbacks?${toQueryString(data)}`);
};
