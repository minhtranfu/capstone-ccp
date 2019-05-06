import DataAccessService from '../../data/data-access-service';

export const getFeebackTypes = () => {
  return DataAccessService.get('/reportTypes');
};

export const getFeebackTypeById = id => {
  return DataAccessService.get(`/reportTypes/${id}`);
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

export const feedbackDebris = data => {
  return DataAccessService.post('/debrisFeedbacks', data);
};

export const feedbackEquipmentTransaction = data => {
  return DataAccessService.post(`/equipmentFeedbacks`, data);
};

export const feedbackMaterialTransaction = data => {
  return DataAccessService.post(`/materialFeedbacks`, data);
};
