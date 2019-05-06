import DataAccessService from '../../data/data-access-service';
import { toQueryString } from 'Utils/common.utils';

export const postFeedback = data => {
  return DataAccessService.post('/debrisFeedbacks', data);
};

export const getFeedbackById = id => {
  return DataAccessService.get(`/debrisFeedbacks/${id}`);
};

export const getFeedbackBySupplierId = (id, queryData) => {
  const data = {
    ...queryData,
    supplierId: id,
  };
  
  return DataAccessService.get(`/debrisFeedbacks?${toQueryString(data)}`);
};
