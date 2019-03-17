import DataAccessService from '../../data/data-access-service';

export const getFeebackTypes = () => {
  return DataAccessService.get('/feedbackTypes');
};

export const getFeebackTypeById = id => {
  return DataAccessService.get(`/feedbackTypes/${id}`);
};

export const postFeedback = ({toContractorId, feedbackTypeId, content}) => {
  return DataAccessService.post('/feedbacks', {
    toContractor: {
      id: toContractorId
    },
    feedbackType: {
      id: feedbackTypeId
    },
    content
  });
};
