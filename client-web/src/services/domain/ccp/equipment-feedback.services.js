import DataAccessService from '../../data/data-access-service';
import { toQueryString } from 'Utils/common.utils';

export const postFeedback = data => {
  return DataAccessService.post('/equipmentFeedbacks', data);
};

export const getFeedbackById = id => {
  return DataAccessService.get(`/equipmentFeedbacks/${id}`);
};

export const getFeedbackBySupplierId = (supplierId, queryData) => {
  console.log({supplierId, queryData});
  const data = {
    ...queryData,
    supplierId,
  };

  return DataAccessService.get(`/equipmentFeedbacks?${toQueryString(data)}`);
};
