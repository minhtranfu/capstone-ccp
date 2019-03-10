import { INITIAL_STATE } from '../../common/app-const';
import { userConstants } from '../_constants';

const authentication = (state = INITIAL_STATE.authentication, action) => {
  switch (action.type) {
    case userConstants.LOGIN_SUCCESS:
      return {
        isAuthenticated: true,
        user: action.user
      };

    case userConstants.LOGIN_REQUEST:
      console.log('Fetching.....');
      return {
        loggingIn: true,
        user: {}
      };

    case userConstants.LOGIN_FAILURE:
      return {
        user: {}
      };

    case userConstants.LOGOUT:
      return {};

    default:
      return state;
  }
};

export default authentication;
