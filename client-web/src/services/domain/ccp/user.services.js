import DataAccessService from '../../data/data-access-service';

export const login = (username, password) => {
  return DataAccessService.post('/authen', { username, password });
};