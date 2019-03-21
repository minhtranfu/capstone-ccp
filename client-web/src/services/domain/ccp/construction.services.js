import DataAccessService from '../../data/data-access-service';

export const postConstruction = (constractorId, data) => {
  return DataAccessService.post(`/contractors/${constractorId}/constructions`, data);
};

export const updateConstruction = (constractorId, constructionId, data) => {
  return DataAccessService.put(`/contractors/${constractorId}/constructions/${constructionId}`, data);
};