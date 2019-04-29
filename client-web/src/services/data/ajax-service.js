import ConfigService from '../common/config-service';
import axios from 'axios';
import { getRefreshToken, setTokens, getRoutePath } from 'Utils/common.utils';
import history from 'Common/createHistory';
import { routeConsts } from 'Common/consts';

const refreshAxios = axios.create({
  baseURL: ConfigService.getBaseUrl(),
  timeout: 60000,
});

/**
 * Service for making AJAX requests.
 * Uses Axios (https://github.com/mzabriskie/axios)
 */
const instance = axios.create({
  baseURL: ConfigService.getBaseUrl(),
  timeout: 60000,
});

// For refresh token
instance.interceptors.response.use(
  // Do nothing on success
  response => {
    console.log(response);

    return response;
  },
  // Check error 401 to refresh token
  error => {

    console.log(error);
    
    // Save origin request config to request again after refresh token
    const originalRequest = error.config;

    if (error.response.status === 401) {

      if (!getRefreshToken()) {
        setTokens('', '');
        history.push(getRoutePath(routeConsts.LOGIN));
      }

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        responseType: 'json',
        data: JSON.stringify({
          refreshToken: getRefreshToken()
        })
      };

      // refresh token
      return refreshAxios
        .request('/authen/refresh', options)
        .then(responseData => {
          // get token, refresh token and persist them
          const { accessToken, refreshToken } = responseData.data.tokenWrapper;
          setTokens(accessToken, refreshToken);
          // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
          return axios(originalRequest);
        })
        .catch(error => {
          setTokens('', '');
          history.push(getRoutePath(routeConsts.LOGIN));
        });
    }

    console.log(error.response.status);

    return Promise.reject(error);
  }
);

export default {
  request(options) {
    return instance.request(options);
  },
};
