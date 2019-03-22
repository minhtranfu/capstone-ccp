import DataAccessService from '../../data/data-access-service';

export const postFeedback = data => {
  return DataAccessService.post('/debrisFeedbacks', data);
};

export const getFeedbackById = id => {
  return DataAccessService.get(`/debrisFeedbacks/${id}`);
};

export const getFeedbackBySupplierId = id => {
  return DataAccessService.get('/debrisFeedbacks/supplier');
};
