import DataAccessService from '../../data/data-access-service';

export const login = (username, password) => {
  return DataAccessService.post('/authen', { username, password });
};

export const getUserInfo = () => {
  return DataAccessService.get('/token/contractor');
};