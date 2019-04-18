import DataAccessService from '../../data/data-access-service';
import { toQueryString } from 'Utils/common.utils';

export const postFeedback = data => {
  return DataAccessService.post('/equipmentFeedbacks', data);
};

export const getFeedbackById = id => {
  return DataAccessService.get(`/equipmentFeedbacks/${id}`);
};

export const getFeedbackBySupplierId = (id, queryData) => {
  return DataAccessService.get(`/equipmentFeedbacks/supplier?${toQueryString(queryData)}`);
};
